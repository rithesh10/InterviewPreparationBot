import pdfplumber
from docx import Document 
import nltk
import fitz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from io import BytesIO

nltk.download('punkt')
nltk.download('stopwords')
from nltk.corpus import stopwords

def extract_text(file_stream, filename):
    """
    Extracts text from PDF, DOC, and DOCX files.
    """
    try:
        file_ext = filename.split(".")[-1].lower()

        if file_ext == "pdf":
            file_stream.seek(0)
            pdf_document = fitz.open(stream=file_stream.read(), filetype="pdf")
            text = "\n".join([page.get_text("text") for page in pdf_document])

        elif file_ext == "docx":
            file_stream.seek(0)
            doc = Document(BytesIO(file_stream.read()))
            text = "\n".join([para.text for para in doc.paragraphs])

        elif file_ext == "txt":
            file_stream.seek(0)
            text = file_stream.read().decode('utf-8')

        else:
            return None

        return text.strip()

    except Exception as e:
        print("Error extracting text:", str(e))
        return None

def preprocess(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = nltk.word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    return " ".join([word for word in tokens if word not in stop_words])

def match_resume(resume_text, job_description):
    if not resume_text or not job_description:
        return 0, set()
    
    resume_clean = preprocess(resume_text)
    jd_clean = preprocess(job_description)

    tfidf = TfidfVectorizer()
    try:
        tfidf_matrix = tfidf.fit_transform([resume_clean, jd_clean])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_percent = round(similarity * 100, 2)
    except:
        match_percent = 0

    jd_words = set(jd_clean.split())
    resume_words = set(resume_clean.split())
    missing_keywords = jd_words - resume_words

    return match_percent, missing_keywords