import groq

GROQ_API_KEY = "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"

groq.api_key = GROQ_API_KEY

model = groq.Model("LLaMA3-8B-8192")

def generate_prompt(prompt):
    try:
        response = model.generate(prompt)
        return response.choices[0].text
    except Exception as e:
        print("Error generating content:", str(e))
        return "Error: " + str(e)