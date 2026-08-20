import json
from collections.abc import Sequence

import httpx

from ...config import Settings
from .provider import AIProviderError, ChatMessage


class OpenAICompatibleProvider:
    """Works with DeepSeek and other OpenAI-compatible chat completion APIs."""

    def __init__(self, settings: Settings) -> None:
        if not settings.ai_api_base or not settings.ai_api_key or not settings.ai_model:
            raise AIProviderError("外部模型配置不完整：请设置 AI_API_BASE、AI_API_KEY 和 AI_MODEL")
        self.base_url = settings.ai_api_base.rstrip("/")
        self.api_key = settings.ai_api_key
        self.model = settings.ai_model
        self.timeout_seconds = settings.ai_timeout_seconds
        self.retry_count = settings.ai_retry_count

    async def complete_json(self, messages: Sequence[ChatMessage]) -> dict:
        payload = {
            "model": self.model,
            "messages": [{"role": item.role, "content": item.content} for item in messages],
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
        }
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        last_error: Exception | None = None
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            for _attempt in range(self.retry_count + 1):
                try:
                    response = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
                    response.raise_for_status()
                    content = response.json()["choices"][0]["message"]["content"]
                    data = json.loads(content)
                    if not isinstance(data, dict):
                        raise AIProviderError("模型未返回 JSON 对象")
                    return data
                except (httpx.HTTPError, KeyError, ValueError, json.JSONDecodeError) as error:
                    last_error = error
        raise AIProviderError(f"外部模型调用失败：{last_error}")
