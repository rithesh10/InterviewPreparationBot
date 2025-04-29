# # from app.config import Config
API_KEY="AIzaSyBXHxyQvTsXUoDB8pWiT0CF7ilGZoMzSE0"


# # Your Gemini API Key
import google.generativeai as genai
genai.configure(api_key=API_KEY)


# # Create the model instance
model = genai.GenerativeModel("gemini-1.5-pro-latest")


async def generate_prompt(prompt):
    try:
        # Here's the key change - we need to await the generate_content call
        response = await model.generate_content(prompt)
        # The response object itself is not awaitable
        return response.text
    except Exception as e:
        print("Error generating content:", str(e))
        return "Error: " + str(e)
# Running async function
# Example of how to run async function
asyncio.run(generate_prompt("Hello! Tell me a joke."))

