import pickle
import numpy as np
import os
base_dir = os.path.dirname(os.path.abspath(__file__))
pickle_path = os.path.join(base_dir, "SentenceTransformer.pkl")
try:
    with open(pickle_path, "rb") as f:
        model, category_columns, category_embeddings = pickle.load(f)
    print("Model  successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model, category_columns, category_embeddings = None, None, None

def model_score(resume, jobDescription):
    resume_embeddings = model.encode(resume)
    jobDescription_embeddings = model.encode(jobDescription)

    resume_embeddings = np.array(resume_embeddings).flatten()
    jobDescription_embeddings = np.array(jobDescription_embeddings).flatten()

    cosine_similarities = np.dot(resume_embeddings, jobDescription_embeddings) / (
        np.linalg.norm(resume_embeddings) * np.linalg.norm(jobDescription_embeddings)
    )

    final_similarity = float(cosine_similarities) * 100
    return final_similarity

def model_fields(resume, category_columns):
    category_embeddings = model.encode(category_columns, normalize_embeddings=True)
    resume_embeddings = model.encode(resume, normalize_embeddings=True)

    cosine_similarities = np.dot(category_embeddings, resume_embeddings.T).flatten()

    num_categories = min(len(category_columns), 2)
    top_indices = np.argsort(cosine_similarities)[-num_categories:][::-1]

    predicted_categories = [category_columns[i] for i in top_indices]
    return predicted_categories