# import pickle
# import numpy as np
# import os
# base_dir = os.path.dirname(os.path.abspath(__file__))
# pickle_path = os.path.join(base_dir, "SentenceTransformer.pkl")
# try:
#     with open(pickle_path, "rb") as f:
#         model, category_columns, category_embeddings = pickle.load(f)
#     print("Model  successfully!")
# except Exception as e:
#     print(f"Error loading model: {e}")
#     model, category_columns, category_embeddings = None, None, None

# def model_score(resume, jobDescription):
#     resume_embeddings = model.encode(resume)
#     jobDescription_embeddings = model.encode(jobDescription)

#     resume_embeddings = np.array(resume_embeddings).flatten()
#     jobDescription_embeddings = np.array(jobDescription_embeddings).flatten()

#     cosine_similarities = np.dot(resume_embeddings, jobDescription_embeddings) / (
#         np.linalg.norm(resume_embeddings) * np.linalg.norm(jobDescription_embeddings)
#     )

#     final_similarity = float(cosine_similarities) * 100
#     return final_similarity

# def model_fields(resume, category_columns):
#     category_embeddings = model.encode(category_columns, normalize_embeddings=True)
#     resume_embeddings = model.encode(resume, normalize_embeddings=True)

#     cosine_similarities = np.dot(category_embeddings, resume_embeddings.T).flatten()

#     num_categories = min(len(category_columns), 2)
#     top_indices = np.argsort(cosine_similarities)[-num_categories:][::-1]

#     predicted_categories = [category_columns[i] for i in top_indices]
#     return predicted_categories
import os
import numpy as np
from google import genai

# Initialize Gemini client
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])  # set your key in env

MODEL = "models/embedding-001"  # Gemini Embedding model
import re

def clean_text(text: str) -> str:
    """Normalize resume/job text"""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)   # replace multiple spaces/newlines with single space
    return text.strip()

def get_embedding(text: str):
    """Get embedding vector from Gemini API"""
    result = client.models.embed_content(
        model=MODEL,
        contents=text
    )
    return np.array(result.embeddings[0].values)


def model_score(resume: str, jobDescription: str) -> float:
    """Cosine similarity score (%) between resume and JD"""
    resume_embeddings = get_embedding(resume).flatten()
    jobDescription_embeddings = get_embedding(jobDescription).flatten()

    cosine_similarities = np.dot(resume_embeddings, jobDescription_embeddings) / (
        np.linalg.norm(resume_embeddings) * np.linalg.norm(jobDescription_embeddings)
    )
    return float(cosine_similarities) * 100


def model_fields(resume: str, category_columns: list[str], top_n: int = 2) -> list[str]:
    """Find top matching categories for resume text"""
    resume = clean_text(resume)
    category_columns = [clean_text(c) for c in category_columns]

    category_embeddings = [get_embedding(c).flatten() for c in category_columns]
    resume_embeddings = get_embedding(resume).flatten()

    similarities = [
        np.dot(cat_emb, resume_embeddings)
        / (np.linalg.norm(cat_emb) * np.linalg.norm(resume_embeddings))
        for cat_emb in category_embeddings
    ]

    num_categories = min(len(category_columns), top_n)
    top_indices = np.argsort(similarities)[-num_categories:][::-1]

    return list(dict.fromkeys(category_columns[i] for i in top_indices))
