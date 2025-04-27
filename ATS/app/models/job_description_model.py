from marshmallow import fields, Schema
class JobDescriptionSchema(Schema):
    _id = fields.String(dump_only=True)
    title = fields.String(required=True)  # Job title
    company = fields.String(required=True)  # Company name
    description = fields.String(required=True)  # Full job description
    required_skills = fields.List(fields.String(), required=True)  # Skills needed
    experience_required = fields.Integer(required=True)  # Years of experience needed
    created_at = fields.DateTime(dump_only=True)