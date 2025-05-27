from marshmallow import fields, Schema
class JobDescriptionSchema(Schema):
    _id = fields.String(dump_only=True)
    title = fields.String(required=True)  
    company = fields.String(required=True) 
    description = fields.String(required=True)  
    required_skills = fields.List(fields.String(), required=True)  
    experience_required = fields.Integer(required=True) 
    created_at = fields.DateTime(dump_only=True)