from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from ..config import Settings
from ..models import AIModelConfig, DailyUsage
from .ai import AIProviderError, ChatMessage, get_ai_provider, runtime_settings


CHINA_TIMEZONE = ZoneInfo("Asia/Shanghai")
PROVIDER_BASE_URLS = {
    "openai": "https://api.openai.com/v1",
    "deepseek": "https://api.deepseek.com/v1",
    "qwen": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "compatible": "",
}


class ConfigurationError(ValueError):
    pass


class DailyLimitExceeded(ValueError):
    def __init__(self, remaining: int):
        super().__init__(f"今日解析额度不足，当前还可解析 {remaining} 份文件")
        self.remaining = remaining


def china_today():
    return datetime.now(CHINA_TIMEZONE).date()


def mask_api_key(api_key: str) -> str:
    if not api_key:
        return ""
    return f"已配置（末尾 {api_key[-4:]}）" if len(api_key) >= 4 else "已配置"


def effective_config(session: Session, settings: Settings) -> AIModelConfig | None:
    return session.get(AIModelConfig, 1)


def config_payload(session: Session, settings: Settings) -> dict:
    config = effective_config(session, settings)
    if config is None:
        return {
            "provider": "compatible" if settings.ai_provider == "openai_compatible" else "deepseek",
            "api_base": settings.ai_api_base,
            "model": settings.ai_model,
            "api_key_configured": bool(settings.ai_api_key),
            "api_key_mask": mask_api_key(settings.ai_api_key),
        }
    return {
        "provider": config.provider,
        "api_base": config.api_base,
        "model": config.model,
        "api_key_configured": bool(config.api_key),
        "api_key_mask": mask_api_key(config.api_key),
    }


def normalize_model_config(session: Session, settings: Settings, provider: str, model: str, api_base: str, api_key: str | None) -> AIModelConfig:
    if provider not in PROVIDER_BASE_URLS:
        raise ConfigurationError("不支持的模型厂商")
    model = model.strip()
    if not model:
        raise ConfigurationError("请填写模型名称")
    normalized_base = api_base.strip().rstrip("/") if provider == "compatible" else PROVIDER_BASE_URLS[provider]
    if not normalized_base:
        raise ConfigurationError("兼容 API 必须填写 Base URL")
    current = effective_config(session, settings)
    inherited_key = current.api_key if current else settings.ai_api_key
    key = api_key.strip() if api_key else inherited_key
    if not key:
        raise ConfigurationError("请填写 API Key")
    return AIModelConfig(id=1, provider=provider, api_base=normalized_base, model=model, api_key=key)


def test_model_config(config: AIModelConfig, settings: Settings) -> None:
    provider = get_ai_provider(runtime_settings(settings, config))
    try:
        result = __import__("asyncio").run(provider.complete_json([
            ChatMessage("system", "请只返回 JSON 对象。"),
            ChatMessage("user", '{"status":"ok"}'),
        ]))
    except AIProviderError:
        raise
    if not isinstance(result, dict):
        raise AIProviderError("模型测试未返回 JSON 对象")


def save_model_config(session: Session, config: AIModelConfig) -> AIModelConfig:
    current = session.get(AIModelConfig, 1)
    if current is None:
        session.add(config)
        saved = config
    else:
        current.provider = config.provider
        current.api_base = config.api_base
        current.model = config.model
        current.api_key = config.api_key
        saved = current
    session.commit()
    session.refresh(saved)
    return saved


def daily_usage(session: Session, settings: Settings) -> dict:
    usage = session.get(DailyUsage, china_today())
    used = usage.accepted_documents if usage else 0
    return {"date": china_today(), "used": used, "limit": settings.daily_parse_limit, "remaining": max(0, settings.daily_parse_limit - used)}


def reserve_daily_usage(session: Session, settings: Settings, count: int) -> dict:
    """Reserve accepted uploads within the same transaction that creates documents."""
    if count <= 0:
        return daily_usage(session, settings)
    today = china_today()
    usage = session.query(DailyUsage).filter(DailyUsage.day == today).with_for_update().one_or_none()
    if usage is None:
        usage = DailyUsage(day=today, accepted_documents=0)
        session.add(usage)
        session.flush()
    remaining = settings.daily_parse_limit - usage.accepted_documents
    if count > remaining:
        raise DailyLimitExceeded(max(0, remaining))
    usage.accepted_documents += count
    return {"date": today, "used": usage.accepted_documents, "limit": settings.daily_parse_limit, "remaining": settings.daily_parse_limit - usage.accepted_documents}
