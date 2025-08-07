import os
from openai import OpenAI

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ["HF_TOKEN"],
)

def generate_prompt(prompt: str) -> str:
    """
    Generate chat completion from the prompt using OpenAI client synchronously.
    """
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b:novita",
            messages=[{"role": "user", "content": prompt}],
        )
        return completion.choices[0].message.content
    except Exception as e:
        print("Error generating content:", e)
        raise

# Usage:
# response = generate_prompt("What is the capital of France?")
# print(response)
