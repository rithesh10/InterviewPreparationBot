from marshmallow import fields, Schema, validate
from datetime import datetime

class ResumeSchema(Schema):
    _id = fields.String(dump_only=True)
    user_name=fields.String(required=True)
    user_id = fields.String(required=True) 
    file_url = fields.String(required=True)  
    job_id=fields.String(required=True)
    skills = fields.List(fields.String(validate=validate.Length(min=1, max=50)), required=True)

    experience = fields.Integer(required=True, validate=validate.Range(min=0))
    resume_text=fields.String()
    created_at = fields.DateTime(dump_only=True)