
# Sample resume
resume_text = ["""rithesh asanthula
7981991406
asanthularithesh@gmail.com
linkedin.com/in/rithesh-asanthula
github.com/rithesh10
leetcode.com/rithesh10
education
keshav memorial institute of technology hyderabad
november 2022 - present
bachelor of science in computer science
8.5 cgpa
technical skills
languages python sql java
data science pandas numpy scikit-learn tensorflow pytorch
machine learning regression classification clustering deep learning
data visualization matplotlib seaborn tableau power bi
databases mysql mongodb postgresql
tools jupyter notebook google colab git github linux
others data wrangling statistical analysis feature engineering model deployment
projects
customer churn prediction machine learning python pandas scikit-learn
february 2025
developed a machine learning model to predict customer churn using logistic regression and random forest
performed exploratory data analysis and feature engineering to improve model accuracy
deployed the model using flask and integrated it into a web application
visualized customer trends using seaborn and tableau
github.com/rithesh10/customer-churn
house price prediction machine learning tensorflow keras
august 2024
built a deep learning model using neural networks to predict house prices based on historical data
preprocessed data using pandas and feature scaling techniques
trained the model using tensorflow achieving high accuracy
deployed the model using fastapi for real-time predictions
github.com/rithesh10/house-price-prediction
sentiment analysis on twitter data nlp nltk transformers huggingface
june 2024
performed sentiment analysis on twitter data using bert and transformers
collected and cleaned data using tweepy and pandas
implemented text preprocessing techniques like tokenization and stopword removal
evaluated model performance using precision recall and f1-score
github.com/rithesh10/twitter-sentiment
healthcare fraud detection data science sql machine learning
april 2024
designed a fraud detection system for healthcare transactions using anomaly detection techniques
implemented unsupervised learning models to detect suspicious claims
optimized sql queries for faster data retrieval and analysis
generated fraud heatmaps using seaborn for better visualization
github.com/rithesh10/healthcare-fraud-detection."""]

import pickle
import numpy as np

with open("SentenceTransformer.pkl", "rb") as f:
    model, category_columns, category_embeddings = pickle.load(f)

print("Model loaded successfully!")
resume_embedding = model.encode(resume_text)

cosine_similarities = np.dot(category_embeddings, resume_embedding.T)

predicted_categories = [category_columns[i] for i in np.argsort(cosine_similarities[:, 0])[-2:]]  

print("Predicted Categories:", predicted_categories)
