# import pdfplumber
# from docx import Document 
# import nltk
# import fitz
# import re
# from io import BytesIO
# import spacy

# from nltk.corpus import stopwords, wordnet
# from nltk.tokenize import word_tokenize
# from nltk.stem import WordNetLemmatizer
# from nltk import pos_tag

# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity

# # Download required NLTK data
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')

# # Load spaCy model and setup
# nlp = spacy.load("en_core_web_sm")
# lemmatizer = WordNetLemmatizer()
# stop_words = set(stopwords.words("english"))

# def get_wordnet_pos(tag):
#     if tag.startswith('J'):
#         return wordnet.ADJ
#     elif tag.startswith('V'):
#         return wordnet.VERB
#     elif tag.startswith('N'):
#         return wordnet.NOUN
#     elif tag.startswith('R'):
#         return wordnet.ADV
#     else:
#         return wordnet.NOUN

# def extract_text(file_stream, filename):
#     try:
#         file_ext = filename.split(".")[-1].lower()
#         if file_ext == "pdf":
#             file_stream.seek(0)
#             pdf_document = fitz.open(stream=file_stream.read(), filetype="pdf")
#             text = "\n".join([page.get_text("text") for page in pdf_document])
#         elif file_ext == "docx":
#             file_stream.seek(0)
#             doc = Document(BytesIO(file_stream.read()))
#             text = "\n".join([para.text for para in doc.paragraphs])
#         elif file_ext == "txt":
#             file_stream.seek(0)
#             text = file_stream.read().decode('utf-8')
#         else:
#             return None
#         return text.strip()
#     except Exception as e:
#         print("Error extracting text:", str(e))
#         return None

# def preprocess(text):
#     text = text.lower()
#     text = re.sub(r'[^a-zA-Z\s]', '', text)
#     tokens = word_tokenize(text)
#     pos_tags = pos_tag(tokens)
#     lemmatized = [lemmatizer.lemmatize(word, get_wordnet_pos(pos)) for word, pos in pos_tags]
#     return " ".join([word for word in lemmatized if word not in stop_words and len(word) > 2])

# def extract_entities(text):
#     doc = nlp(text)
#     skills = set()

#     # 1. Extract spaCy entities
#     for ent in doc.ents:
#         if ent.label_ in {"ORG", "PRODUCT", "WORK_OF_ART", "LANGUAGE", "SKILL", "TECH"}:
#             skills.add(ent.text.lower().strip())

#     # 2. Add noun chunks and proper nouns that spaCy may miss
#     for chunk in doc.noun_chunks:
#         if 1 <= len(chunk.text.strip()) <= 40:  # Avoid very long strings
#             root = chunk.root
#             if root.pos_ in {"PROPN", "NOUN"} and chunk.text.lower() not in stop_words:
#                 skills.add(chunk.text.lower().strip())

#     return skills

# def match_resume(resume_text, job_description):
#     if not resume_text or not job_description:
#         return {
#             "skill_match_score": 0,
#             "similarity_score": 0,
#             "overall_score": 0,
#             "matching_skills": set(),
#             "missing_skills": set()
#         }

#     # Extract and preprocess
#     resume_entities = extract_entities(resume_text)
#     jd_entities = extract_entities(job_description)

#     resume_clean = preprocess(resume_text)
#     jd_clean = preprocess(job_description)

#     resume_words = set(resume_clean.split())
#     jd_words = set(jd_clean.split())

#     # Matching and missing skills
#     matching_skills = (resume_words | resume_entities) & (jd_words | jd_entities)
#     missing_skills = (jd_words | jd_entities) - (resume_words | resume_entities)

#     # Skill match score (keyword overlap)
#     skill_match_score = round((len(matching_skills) / (len(jd_words | jd_entities))) * 100, 2) if jd_words else 0

#     # TF-IDF Similarity
#     tfidf = TfidfVectorizer()
#     try:
#         tfidf_matrix = tfidf.fit_transform([resume_clean, jd_clean])
#         similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
#         similarity_score = round(similarity * 100, 2)
#     except:
#         similarity_score = 0

#     # Final weighted score
#     overall_score = round(similarity_score * 0.5 + skill_match_score * 0.5, 2)

#     return {
#         "skill_match_score": skill_match_score,
#         "similarity_score": similarity_score,
#         "overall_score": overall_score,
#         "matching_skills": matching_skills,
#         "missing_skills": missing_skills
#     }
# -------------------------------
# DUMMY NLP MODULE (NO IMPORTS)
# -------------------------------

def extract_text(file_stream, filename):
    """
    Dummy text extractor.
    Always returns a simple placeholder string
    regardless of input.
    """
    return "dummy extracted text from file"


def preprocess(text):
    """
    Dummy preprocessing.
    Converts text to lowercase and strips spaces.
    """
    if not text:
        return ""
    return text.lower().strip()


def extract_entities(text):
    """
    Dummy entity extractor.
    Returns a fixed set of fake skills/entities.
    """
    return {"python", "java", "machine learning"}


def match_resume(resume_text, job_description):
    """
    Dummy ATS matching logic.
    Returns predictable fixed scores so frontend can integrate.
    """

    # If either empty, return zeros
    if not resume_text or not job_description:
        return {
            "skill_match_score": 0,
            "similarity_score": 0,
            "overall_score": 0,
            "matching_skills": set(),
            "missing_skills": set()
        }

    # Dummy behavior
    matching_skills = {"python", "java"}
    missing_skills = {"docker", "kubernetes"}

    skill_match_score = 75.0      # fixed dummy score
    similarity_score = 62.5       # fixed dummy score
    overall_score = (75.0 * 0.5) + (62.5 * 0.5)

    return {
        "skill_match_score": round(skill_match_score, 2),
        "similarity_score": round(similarity_score, 2),
        "overall_score": round(overall_score, 2),
        "matching_skills": matching_skills,
        "missing_skills": missing_skills
    }
