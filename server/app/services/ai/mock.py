from collections.abc import Sequence

from .provider import ChatMessage


class MockAIProvider:
    """Safe default used until a server-side API key is configured."""

    async def complete_json(self, messages: Sequence[ChatMessage]) -> dict:
        question = next((message.content for message in reversed(messages) if message.role == "user"), "")
        return {
            "answerType": "insufficient_evidence",
            "title": "等待检索资料",
            "summary": "未在当前上传的文档或知识库中找到足够依据。",
            "sections": [{"title": "当前问题", "content": question}],
            "metrics": [],
            "charts": [],
            "risks": [],
            "decisions": [],
            "citations": [],
        }
