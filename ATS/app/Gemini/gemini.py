import os
from typing import List, Optional

import google.generativeai as genai
from groq import Groq
from openai import OpenAI


class AIProviderError(Exception):
    pass


def _provider_order() -> List[str]:
    # Configure preference: google,groq,huggingface,openrouter
    configured = os.getenv("AI_PROVIDER_ORDER", "google,groq,huggingface,openrouter")
    return [name.strip().lower() for name in configured.split(",") if name.strip()]


def _generate_with_google(prompt: str) -> str:
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY")
    if not api_key:
        raise AIProviderError("GOOGLE_API_KEY/GEMINI_API_KEY not configured")

    model_name = os.getenv("GOOGLE_MODEL", "gemini-2.0-flash")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)
    response = model.generate_content(prompt)
    text = getattr(response, "text", None)
    if not text:
        raise AIProviderError("Google provider returned empty response")
    return text


def _generate_with_groq(prompt: str) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise AIProviderError("GROQ_API_KEY not configured")

    model_name = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    client = Groq(api_key=api_key)
    completion = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}],
    )
    text = completion.choices[0].message.content if completion.choices else None
    if not text:
        raise AIProviderError("Groq provider returned empty response")
    return text


def _generate_with_huggingface(prompt: str) -> str:
    api_key = os.getenv("HF_TOKEN")
    if not api_key:
        raise AIProviderError("HF_TOKEN not configured")

    model_name = os.getenv("HF_MODEL", "openai/gpt-oss-120b:novita")
    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=api_key,
    )
    completion = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}],
    )
    text = completion.choices[0].message.content if completion.choices else None
    if not text:
        raise AIProviderError("HuggingFace provider returned empty response")
    return text


def _generate_with_openrouter(prompt: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise AIProviderError("OPENROUTER_API_KEY not configured")

    model_name = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free")
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
    completion = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}],
    )
    text = completion.choices[0].message.content if completion.choices else None
    if not text:
        raise AIProviderError("OpenRouter provider returned empty response")
    return text


def _call_provider(provider: str, prompt: str) -> str:
    if provider == "google":
        return _generate_with_google(prompt)
    if provider == "groq":
        return _generate_with_groq(prompt)
    if provider == "huggingface":
        return _generate_with_huggingface(prompt)
    if provider == "openrouter":
        return _generate_with_openrouter(prompt)
    raise AIProviderError(f"Unsupported provider '{provider}'")


def generate_prompt(prompt: str, provider: Optional[str] = None) -> str:
    """
    Generate a response using one or many providers.

    If `provider` is passed, only that provider is used.
    Otherwise providers are tried in AI_PROVIDER_ORDER until one succeeds.
    """
    errors = []
    providers = [provider.lower()] if provider else _provider_order()

    for current_provider in providers:
        try:
            return _call_provider(current_provider, prompt)
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{current_provider}: {exc}")
            print(f"[AI][{current_provider}] failed: {exc}")

    raise RuntimeError("All AI providers failed. " + " | ".join(errors))
