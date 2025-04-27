from marshmallow import Schema, fields

class ResumeRankingSchema(Schema):
    _id = fields.Str(dump_only=True)
    resume_id = fields.Str(required=True)
    job_id = fields.Str(required=True)
    ai_score = fields.Float(required=True)
    user_id=fields.Str(required=True)
    matching_skills = fields.List(fields.Str(), required=False)
    missing_skills = fields.List(fields.Str(), required=False)
    experience_match = fields.Boolean(required=False)
    suggestions = fields.Str(required=False)
    # created_at = fields.DateTime(dump_only=True)

resume_ranking_schema = ResumeRankingSchema()
resume_rankings_schema = ResumeRankingSchema(many=True)

