from collections.abc import Sequence
from dataclasses import dataclass
from typing import Protocol


class AIProviderError(RuntimeError):
    pass


@dataclass(frozen=True)
class ChatMessage:
    role: str
    content: str


class AIProvider(Protocol):
    """Provider contract used by future chat and report services."""

    async def complete_json(self, messages: Sequence[ChatMessage]) -> dict:
        """Return a parsed JSON object or raise AIProviderError."""
