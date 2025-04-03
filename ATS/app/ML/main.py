from app.ML.cleaned_text import clean_text
from app.ML.model import model_score,model_fields
def find_the_score(resume,jobDescription):
    cleaned_resume=clean_text(resume)
    cleaned_jobDescription=clean_text(jobDescription)
    score =model_score(cleaned_resume,cleaned_jobDescription)
    return score
def find_the_fields(resume,fields):
    cleaned_resume=clean_text(resume)
    fields=model_fields(cleaned_resume,fields)
    return fields
