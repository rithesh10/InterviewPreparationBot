import re
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download necessary NLTK data files
# nltk.download('stopwords')
# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('punkt_tab')
# Initialize Lemmatizer
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def clean_text(text):
    # 1️⃣ Convert to lowercase
    text = text.lower()

    # 2️⃣ Remove special characters, punctuation & numbers
    text = re.sub(r'[^a-z\s]', '', text)  # Keeps only letters and spaces

    # 3️⃣ Tokenization
    tokens = word_tokenize(text)

    # 4️⃣ Remove stopwords & apply lemmatization
    processed_tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]

    # 5️⃣ Join tokens back into string
    return " ".join(processed_tokens)