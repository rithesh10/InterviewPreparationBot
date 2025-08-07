from marshmallow import Schema, fields

class JobSchema(Schema):
    title = fields.String(required=True)
    company = fields.String(required=True)
    location = fields.String(required=True)
    description = fields.String(required=True)
    requirements = fields.List(fields.String(), required=True)
    salary_range = fields.String()
    posted_date = fields.DateTime()
    application_deadline = fields.DateTime()
    employment_type = fields.String()  #"Full-Time", "Part-Time", "Contract"
    skills_required = fields.List(fields.String(), required=True)
    experience_level = fields.Integer()  #"Entry-Level", "Mid-Level", "Senior"
    status = fields.String(default="Open")  #"Open", "Closed"

job_schema = JobSchema()
jobs_schema = JobSchema(many=True)