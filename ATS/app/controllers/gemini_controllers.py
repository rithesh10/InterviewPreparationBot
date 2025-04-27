import re
# from app.Gemini.gemini import generate_prompt
from flask import request, jsonify, g
from datetime import datetime
from db.db import mongo
import asyncio
from bson import ObjectId,json_util
import json
from pymongo.errors import PyMongoError
API_KEY="AIzaSyBXHxyQvTsXUoDB8pWiT0CF7ilGZoMzSE0"


# # Your Gemini API Key
import google.generativeai as genai
genai.configure(api_key=API_KEY)


# # Create the model instance
model = genai.GenerativeModel("gemini-1.5-pro-latest")

def start_interview():
    """Start the interview process."""
    try:
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
        question = model.generate_content(prompt).text
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
        return jsonify({
            "question": question,
            "interview_id": str(interview_session.inserted_id)
        }), 200

    except KeyError as e:
        return jsonify({"error": f"Missing field in request: {str(e)}"}), 400

    except PyMongoError as e:
        print("database error",str(e))
        return jsonify({"error": "Database error", "details": str(e)}), 500

    except Exception as e:
        print("",str(e))
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

def answer_question():
    """Process the candidate's answer and continue the interview."""
    try:
        data = request.json
        interview_id = data['interview_id']
        answer = data.get("answer")
        
        if not answer:
            return jsonify({"error": "No answer provided"}), 400
        
        object_id = ObjectId(interview_id)
        
        # Fetch the interview session
        interview_session = mongo.db.interview_sessions.find_one({"_id": object_id})
        
        if not interview_session:
            return jsonify({"error": "Interview session not found"}), 404
        
        # Append answer to last question
        interview_session['qa_history'][-1]["a"] = answer
        
        # Build the conversation context
        qa_pairs = "\n".join([f"Q: {x['q']}\nA: {x['a']}" for x in interview_session['qa_history']])
        prompt = f"""
        You are an AI interviewer.

        Job Description: {interview_session['jd_summary']}
        Candidate Resume: {interview_session['resume_summary']}

        Previous Q&A:
        {qa_pairs}

        Now, ask the next question.
        """
        
        # Generate next question
        next_question = model.generate_content(prompt).text
        
        # Append question
        interview_session['qa_history'].append({"q": next_question, "a": ""})
        
        # Check if interview should conclude
        max_questions = 10
        if len(interview_session['qa_history']) >= max_questions:
            conclusion_message = "Thank you for your responses. The interview is now concluded."
            interview_session['qa_history'].append({"q": conclusion_message, "a": ""})
            
            mongo.db.interview_sessions.update_one(
                {"_id": object_id},
                {"$set": {"qa_history": interview_session['qa_history']}}
            )
            
            return jsonify({
                "question": conclusion_message,
                "status": "concluded",
                "interview_score": True
            })
        
        # Update interview session
        mongo.db.interview_sessions.update_one(
            {"_id": object_id},
            {"$set": {"qa_history": interview_session['qa_history']}}
        )
        
        return jsonify({
            "question": next_question,
            "interview_score": False
        })
    
    except KeyError as e:
        return jsonify({"error": f"Missing field in request: {str(e)}"}), 400
    
    except PyMongoError as e:
        print("database error",str(e))
        return jsonify({"error": "Database error", "details": str(e)}), 500
    
    except Exception as e:
        print("An unexpected error occurred",str(e))
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
def summary_of_text():
    """Summarizes the resume and job description to extract key points."""
    try:
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
        resume_summary = model.generate_content(resume_prompt).text
        
        # Create a prompt to summarize the job description
        job_desc_prompt = f"""
        You are a summarizer. Given the following job description, extract the key responsibilities, skills required, and any important details. Provide a concise summary of the job.
        Job Description: {job_description}
        """
        
        # Generate job description summary
        job_summary = model.generate_content(job_desc_prompt).text
        
        return jsonify({
            "resume_summary": resume_summary,
            "job_description_summary": job_summary
        }), 200
    
    except KeyError as e:
        return jsonify({"error": f"Missing field in request: {str(e)}"}), 400
    
    except PyMongoError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
def calculate_score(id):
    try:
        # Fetch the interview session data from the database
        object_id = ObjectId(id)
        interview_data = mongo.db.interview_sessions.find_one({"_id": object_id})
        
        # Check if interview_data was found
        if not interview_data:
            return jsonify({"error": "Interview session not found"}), 404
        
        qa_data = interview_data.get("qa_history")
        user_id = g.user["_id"]  # Assuming interview_sessions has a 'user_id' field
        
        # Ensure qa_data exists
        if not qa_data:
            return jsonify({"error": "Q&A history is missing"}), 400
        
        if not user_id:
            return jsonify({"error": "User ID missing in interview session data"}), 400

        # Build the prompt for the AI model
        prompt = f"""
        You are an expert interview analysis agent. Your task is to evaluate the interview session based on the provided Q&A data below.

        Q&A History:
        {qa_data}

        Please return your analysis strictly in the following JSON format:

        {{
          "score": <integer, 0-100>,
          "summary": "<brief summary of the candidate's overall performance>",
          "strengths": ["<point 1>", "<point 2>", "..."],
          "weaknesses": ["<point 1>", "<point 2>", "..."],
          "suggestions": ["<actionable recommendation 1>", "..."],
          "communication_skills": "<evaluation of clarity, confidence, and articulation>",
          "technical_knowledge": "<evaluation of domain and technical understanding>",
          "soft_skills": "<evaluation of professionalism, problem-solving, etc.>",
          "red_flags": ["<if any major concerns>", "..."]
        }}

        Be objective, concise, and base your analysis only on the provided Q&A history.
        """

        # Call the model to generate content based on the prompt
        response = model.generate_content(prompt)

        if not response or not hasattr(response, 'text') or not response.text.strip():
            return jsonify({"error": "Received empty or invalid response from the model"}), 500

        # Print the raw response for debugging
        print("Raw response from model:", response.text)

        # Use regex to remove ```json and ``` backticks
        response_text = re.sub(r'```json|```', '', response.text).strip()

        # Try parsing the JSON response
        try:
            result = json.loads(response_text)
        except json.JSONDecodeError as e:
            return jsonify({"error": f"Failed to parse the model response as JSON: {str(e)}"}), 500

        if not isinstance(result, dict):
            return jsonify({"error": "Invalid response format from model"}), 500
        
        # Add user_id and interview_session_id to the result
        result['user_id'] = user_id
        result['interview_session_id'] = str(object_id)  # Store the interview session id for reference

        # Save the result into MongoDB
        mongo.db.interview_scores.insert_one(result)

        # Successfully return the generated content
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500