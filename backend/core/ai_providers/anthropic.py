"""
Anthropic Claude AI Provider
Vision API for slide analysis and speaker notes generation
"""

import base64
import io
from typing import Optional
from PIL import Image

try:
    import anthropic
except ImportError:
    anthropic = None

from .base import AIProvider


class AnthropicProvider(AIProvider):
    """Anthropic Claude Vision API provider."""

    MODELS = [
        "claude-3-5-sonnet-20241022",  # 최신 Claude 3.5 Sonnet (권장)
        "claude-3-5-haiku-20241022",   # 빠른 Claude 3.5 Haiku
        "claude-3-opus-20240229",      # 고품질 Claude 3 Opus
    ]

    def __init__(self, api_key: str, model: str = "claude-3-5-sonnet-20241022"):
        """
        Initialize Anthropic provider.

        Args:
            api_key: Anthropic API key
            model: Claude model to use (default: claude-sonnet-4-5)
        """
        if anthropic is None:
            raise ImportError(
                "anthropic package not found. "
                "Install with: pip install anthropic"
            )

        super().__init__(api_key, model)
        self.client = anthropic.Anthropic(api_key=api_key)

    def _image_to_base64(self, image: Image.Image) -> str:
        """Convert PIL Image to base64 string."""
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
        return base64.b64encode(buffer.getvalue()).decode('utf-8')

    def analyze_slide(
        self,
        image: Image.Image,
        context: Optional[str] = None
    ) -> str:
        """
        Analyze slide image using Claude Vision.

        Args:
            image: PIL Image of the slide
            context: Optional context materials

        Returns:
            Generated speaker notes
        """
        prompt = self._get_prompt(context)
        image_b64 = self._image_to_base64(image)

        message = self.client.messages.create(
            model=self.model,
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": image_b64
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        )

        return message.content[0].text

    def get_available_models(self) -> list[str]:
        """Get available Claude models."""
        return self.MODELS
