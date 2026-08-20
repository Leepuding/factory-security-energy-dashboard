from ...config import Settings, get_settings
from .mock import MockAIProvider
from .openai_compatible import OpenAICompatibleProvider
from .provider import AIProvider, AIProviderError


def runtime_settings(settings: Settings, config) -> Settings:
    """Overlay the persisted admin configuration onto deployment defaults."""
    if config is None:
        return settings
    return settings.model_copy(update={
        "ai_provider": "openai_compatible",
        "ai_api_base": config.api_base,
        "ai_api_key": config.api_key,
        "ai_model": config.model,
    })


def get_ai_provider(settings: Settings | None = None) -> AIProvider:
    active_settings = settings or get_settings()
    if active_settings.ai_provider == "mock":
        return MockAIProvider()
    if active_settings.ai_provider == "openai_compatible":
        return OpenAICompatibleProvider(active_settings)
    raise AIProviderError(f"不支持的 AI_PROVIDER：{active_settings.ai_provider}")
