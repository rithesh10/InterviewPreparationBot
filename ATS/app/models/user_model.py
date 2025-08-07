from marshmallow import Schema, fields

class UserSchema(Schema):
    _id = fields.String(dump_only=True)  
    full_name = fields.String(required=True)
    email = fields.Email(required=True)
    refresh_token=fields.String(missing=None)
    password=fields.String(required=True)
    role = fields.String(missing="user")   
    phone = fields.String(required=True)
    resumes = fields.List(fields.String(), dump_only=True)  
    created_at = fields.DateTime(dump_only=True) 
