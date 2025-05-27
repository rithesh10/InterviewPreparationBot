import re
# from app.Gemini.gemini import generate_prompt
from flask import request, jsonify, g
from datetime import datetime
from db.db import mongo
import asyncio
from bson import ObjectId,json_util
import json
from pymongo.errors import PyMongoError
API_KEY="AIzaSyC8Vywy2bR8VZ7mHzN_quY3OlmKeD7Z_eo"
from groq import Groq

client = Groq(api_key="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")

def generate_prompt(prompt):
    try:
        response = client.chat.completions.create(
            model="LLaMA3-8B-8192",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print("Error generating content:", str(e))
        return "Error: " + str(e)
# API_KEY="AIzaSyBXHxyQvTsXUoDB8pWiT0CF7ilGZoMzSE0"
# import google.generativeai as genai
# genai.configure(api_key=API_KEY)

# model = genai.GenerativeModel("gemini-1.5-pro-latest")

def start_interview():
    """Start the interview process."""
    try:
        data = request.json
        resume_summary = data['resume_summary']
        jd_summary = data['jd_summary']
        
        prompt = f"""
        You are an AI interviewer for this job.

        Job Description: {jd_summary}
        Candidate Resume: {resume_summary}

        Ask the first question.
        """
        # question = model.generate_content(prompt).text
        question=generate_prompt(prompt)
        print(question)
        
        interview_data = {
            "resume_summary": resume_summary,
            "jd_summary": jd_summary,
            "qa_history": [{"q": question, "a": ""}],
            "start_time": datetime.now(),
            "user_id": g.user["_id"],
        }
        
        interview_session = mongo.db.interview_sessions.insert_one(interview_data)
        
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
        
        interview_session = mongo.db.interview_sessions.find_one({"_id": object_id})
        
        if not interview_session:
            return jsonify({"error": "Interview session not found"}), 404
        
        interview_session['qa_history'][-1]["a"] = answer
        
        qa_pairs = "\n".join([f"Q: {x['q']}\nA: {x['a']}" for x in interview_session['qa_history']])
        prompt = f"""
        You are an AI interviewer.

        Job Description: {interview_session['jd_summary']}
        Candidate Resume: {interview_session['resume_summary']}

        Previous Q&A:
        {qa_pairs}

        Now, ask the next question.
        """
        
        # next_question = model.generate_content(prompt).text
        next_question=generate_prompt(prompt)
        
        interview_session['qa_history'].append({"q": next_question, "a": ""})
        
        max_questions = 3
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
        
        resume_prompt = f"""
        You are a summarizer. Given the following resume, extract the key skills, experience, and technologies used. Provide a concise summary of the important points.
        Resume: {resume}
        """
        
        # resume_summary = model.generate_content(resume_prompt).text
        resume_summary=generate_prompt(resume_prompt)
        
        # Create a prompt to summarize the job description
        job_desc_prompt = f"""
        You are a summarizer. Given the following job description, extract the key responsibilities, skills required, and any important details. Provide a concise summary of the job.
        Job Description: {job_description}
        """
        
        job_summary = generate_prompt(job_desc_prompt)
        
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
        object_id = ObjectId(id)
        interview_data = mongo.db.interview_sessions.find_one({"_id": object_id})
        print(interview_data)
        
        if not interview_data:
            return jsonify({"error": "Interview session not found"}), 404
        
        qa_data = interview_data.get("qa_history")
        user_id = g.user["_id"] 

        if not qa_data:
            return jsonify({"error": "Q&A history is missing"}), 400
        
        if not user_id:
            return jsonify({"error": "User ID missing in interview session data"}), 400

        prompt = f"""
                    You are a no-nonsense, highly critical interview analysis agent. Your job is to rigorously and objectively evaluate the candidate’s performance based solely on the Q&A transcript below.

                    Q&A Transcript:
                    {qa_data}

                    Your evaluation must be brutally honest and strictly follow this JSON format:

                    {{
                    "score": <integer, 0-100>,
                    "summary": "<brief, no-fluff summary of overall performance. Do not sugarcoat.>",
                    "strengths": ["<specific, concise points backed by evidence>", "..."],
                    "weaknesses": ["<clear, critical observations>", "..."],
                    "suggestions": ["<direct, actionable improvements with no soft language>", "..."],
                    "communication_skills": "<evaluate clarity, confidence, articulation — no sympathy for hesitations or vague answers>",
                    "technical_knowledge": "<evaluate depth, accuracy, and relevance of technical answers — highlight gaps directly>",
                    "soft_skills": "<evaluate professionalism, composure, problem-solving — mention if any immaturity or indecision is shown>",
                    "red_flags": ["<any signs of unpreparedness, dishonesty, poor attitude>", "..."]
                    }}

                    SCORING RULES:
                    - Only award a score above 80 if the candidate shows exceptional performance with minimal flaws.
                    - A score of 40-79 reflects mediocre to moderately competent performance with clear areas of concern.
                    - A score below 30 indicates poor or unacceptable performance.
                    - Do not be lenient. If in doubt, deduct points.

                    Maintain a critical, unemotional tone. Never assume intent — judge only based on the content of the Q&A.
                    """


        # Call the model to generate content based on the prompt
        # response = model.generate_content(prompt)
        response = generate_prompt(prompt)
        
        # if not response or not hasattr(response, 'text') or not response.text.strip():
        #     return jsonify({"error": "Received empty or invalid response from the model"}), 500

        # Print the raw response for debugging
        # print("Raw response from model:", response)
        # print(response)
        # Step 1: Clean and prepare response text
        clean_text = re.sub(r'```json|```', '', response).strip()
        print("Cleaned Text:", clean_text)  # Optional for debugging
        # print(clean_text)
        # Step 2: Start parsing from the first '{'
        first_brace = clean_text.find('{')
        last_brace = clean_text.rfind('}')
        if first_brace == -1:
            return jsonify({"error": "No opening { found in model response"}), 500

        response_text = clean_text[first_brace:last_brace + 1]
        print(response_text)

        # Step 3: Try parsing JSON
        try:
            result = json.loads(response_text)
        except json.JSONDecodeError as e:
            return jsonify({"error": f"Failed to parse the model response as JSON: {str(e)}"}), 500

        if not isinstance(result, dict):
            return jsonify({"error": "Invalid response format from model"}), 500
        
        result['user_id'] = user_id
        result['interview_session_id'] = str(object_id)

        mongo.db.interview_scores.insert_one(result)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


def get_calculated_score(id):
    try:
        calculate_score=mongo.db.interview_scores.find({"user_id":id})
        if not calculate_score:
            return jsonify({"message":"Score not found"}), 404
        return jsonify({"interview_score":list(calculate_score)}),200
    except Exception as e:
        return json_util({"error":"Interval server error","details":str(e)}),500