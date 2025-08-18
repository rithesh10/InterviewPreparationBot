import re
# from app.Gemini.gemini import generate_prompt
from flask import request, jsonify, g
from datetime import datetime
from db.db import mongo
import asyncio
from bson import ObjectId,json_util
import json
import asyncio
from pymongo.errors import PyMongoError
from app.Gemini.gemini import generate_prompt
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
        question =  generate_prompt(prompt=prompt)
        # print(question)
        
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
        
        # Generate next question
        next_question =  generate_prompt(prompt=prompt)
        
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
        
        # Generate resume summary
        resume_summary = generate_prompt(prompt=resume_prompt)
        
        # Create a prompt to summarize the job description
        job_desc_prompt = f"""
        You are a summarizer. Given the following job description, extract the key responsibilities, skills required, and any important details. Provide a concise summary of the job.
        Job Description: {job_description}
        """
        
        # Generate job description summary
        job_summary = generate_prompt(prompt=job_desc_prompt)
        
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
        print(f"[DEBUG] Incoming interview session ID: {id}")

        # Convert to ObjectId
        try:
            object_id = ObjectId(id)
            print(f"[DEBUG] Converted to ObjectId: {object_id}")
        except Exception as conv_err:
            print(f"[ERROR] Failed to convert ID to ObjectId: {conv_err}")
            return jsonify({"error": "Invalid ID format"}), 400

        # Fetch interview data
        interview_data = mongo.db.interview_sessions.find_one({"_id": object_id})
        print(f"[DEBUG] Interview data fetched: {interview_data is not None}")

        if not interview_data:
            return jsonify({"error": "Interview session not found"}), 404

        qa_data = interview_data.get("qa_history")
        print(f"[DEBUG] QA Data length: {len(qa_data) if qa_data else 'None'}")

        user_id = g.user.get("_id") if hasattr(g, "user") else None
        print(f"[DEBUG] Extracted user_id: {user_id}")

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
        print("[DEBUG] Prompt prepared for model call.")

        # Call model
        response = generate_prompt(prompt=prompt)
        print(f"[DEBUG] Raw response type: {type(response)}")

        # Get response text safely
        response_text = response.text if hasattr(response, "text") else str(response)
        print(f"[DEBUG] Raw response text length: {len(response_text)}")

        # Clean up common wrappers like ```json ... ```
        cleaned_text = re.sub(r"```json|```", "", response_text, flags=re.IGNORECASE).strip()

        # Try to extract the first {...} block
        match = re.search(r"\{.*\}", cleaned_text, re.DOTALL)
        if match:
            json_str = match.group(0).strip()
        else:
            # fallback: maybe the whole response is JSON already
            json_str = cleaned_text.strip()

        print(f"[DEBUG] Extracted JSON snippet:\n{json_str[:500]}...")

        # Parse JSON
        try:
            result = json.loads(json_str)
            print("[DEBUG] JSON parsed successfully.")
        except json.JSONDecodeError as e:
            print(f"[ERROR] Failed to parse JSON: {e}")
            return jsonify({"error": f"Failed to parse model response as JSON: {str(e)}"}), 500

        # Add metadata
        result['user_id'] = user_id
        result['interview_session_id'] = str(object_id)

        insert_result = mongo.db.interview_scores.insert_one(result)
        print(f"[DEBUG] Inserted score doc ID: {insert_result.inserted_id}")

        return jsonify(result), 200

    except Exception as e:
        print(f"[FATAL ERROR] {str(e)}", flush=True)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

def get_calculated_score(id):
    try:
        calculate_score=mongo.db.interview_scores.find({"user_id":id})
        if not calculate_score:
            return jsonify({"message":"Score not found"}), 404
        return jsonify({"interview_score":list(calculate_score)}),200
    except Exception as e:
        return json_util({"error":"Interval server error","details":str(e)}),500