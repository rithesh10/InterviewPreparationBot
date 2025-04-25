# from app.Gemini.gemini import generate_prompt
from flask import request, jsonify, g
from datetime import datetime
from db.db import mongo
import asyncio
from bson import ObjectId,json_util
API_KEY="AIzaSyBXHxyQvTsXUoDB8pWiT0CF7ilGZoMzSE0"


# # Your Gemini API Key
import google.generativeai as genai
genai.configure(api_key=API_KEY)


# # Create the model instance
model = genai.GenerativeModel("gemini-1.5-pro-latest")

def start_interview():
    """Start the interview process."""
    data = request.json
    resume_summary = data['resume_summary']
    jd_summary = data['jd_summary']
    
    # Generate the first question
    prompt = f"""
    You are an AI interviewer for this job.

    Job Description: {jd_summary}
    Candidate Resume: {resume_summary}

    Ask the first question.
    """
    
    # Create a new event loop for synchronous context
    # loop = asyncio.new_event_loop()
    # asyncio.set_event_loop(loop)
    # try:
    #     question = loop.run_until_complete(generate_prompt(prompt))
    # finally:
    #     loop.close()
    question=model.generate_content(prompt)
    question=question.text
    print(question)
    
    # Save interview session to MongoDB
    interview_data = {
        "resume_summary": resume_summary,
        "jd_summary": jd_summary,
        "qa_history": [{"q": question, "a": ""}],
        "start_time": datetime.now(),
        "user_id": g.user["_id"],
    }
    
    # Insert the interview data into MongoDB collection
    interview_session = mongo.db.interview_sessions.insert_one(interview_data)
    
    # Return the first question to the client
    return jsonify({"question": question, "interview_id": str(interview_session.inserted_id)}), 200

def answer_question():
    """Process the candidate's answer and continue the interview."""
    data = request.json
    interview_id = data['interview_id']
    answer = data.get("answer")
    
    if not answer:
        return jsonify({"error": "No answer provided"}), 400
    
    object_id = ObjectId(interview_id)
    # Fetch the interview session from MongoDB by interview_id
    interview_session = mongo.db.interview_sessions.find_one({"_id": object_id})
    
    if not interview_session:
        return jsonify({"error": "Interview session not found"}), 404
    
    # Append the answer to the last question in the session
    interview_session['qa_history'][-1]["a"] = answer
    
    # Build the conversation context for the next question
    qa_pairs = "\n".join([f"Q: {x['q']}\nA: {x['a']}" for x in interview_session['qa_history']])
    prompt = f"""
    You are an AI interviewer.

    Job Description: {interview_session['jd_summary']}
    Candidate Resume: {interview_session['resume_summary']}

    Previous Q&A:
    {qa_pairs}

    Now, ask the next question.
    """
    
    # Generate the next question
    next_question = model.generate_content(prompt)
    next_question = next_question.text
    
    # Append the new question to MongoDB session
    interview_session['qa_history'].append({"q": next_question, "a": ""})
    
    # Define a condition to conclude the interview (e.g., after 5 questions)
    max_questions = 10  # Change this to whatever number is appropriate for your interview flow
    if len(interview_session['qa_history']) >= max_questions:
        conclusion_message = "Thank you for your responses. The interview is now concluded."
        interview_session['qa_history'].append({"q": conclusion_message, "a": ""})
        
        # Update the interview session in MongoDB
        mongo.db.interview_sessions.update_one(
            {"_id": ObjectId(interview_id)}, 
            {"$set": {"qa_history": interview_session['qa_history']}}
        )
        
        # Return the conclusion message to the client
        return jsonify({"question": conclusion_message, "status": "concluded"})
    
    # Update the interview session in MongoDB
    mongo.db.interview_sessions.update_one(
        {"_id": ObjectId(interview_id)}, 
        {"$set": {"qa_history": interview_session['qa_history']}}
    )
    
    # Return the next question to the client
    return jsonify({"question": next_question})
from flask import request, jsonify
from datetime import datetime

def summary_of_text():
    """Summarizes the resume and job description to extract key points."""
    data = request.json
    resume = data.get("resume")
    job_description = data.get("job_description")
    
    if not resume or not job_description:
        return jsonify({"error": "Both resume and job description are required"}), 400
    
    # Create a prompt to summarize the resume
    resume_prompt = f"""
    You are a summarizer. Given the following resume, extract the key skills, experience, and technologies used. Provide a concise summary of the important points.
    Resume: {resume}
    """
    
    # Generate resume summary
    resume_summary = model.generate_content(resume_prompt)
    resume_summary = resume_summary.text  # Assuming this is how you get the summary from your model
    
    # Create a prompt to summarize the job description
    job_desc_prompt = f"""
    You are a summarizer. Given the following job description, extract the key responsibilities, skills required, and any important details. Provide a concise summary of the job.
    Job Description: {job_description}
    """
    
    # Generate job description summary
    job_summary = model.generate_content(job_desc_prompt)
    job_summary = job_summary.text  # Assuming this is how you get the summary from your model
    
    # Return the summaries as a response
    return jsonify({"resume_summary": resume_summary, "job_description_summary": job_summary}), 200
