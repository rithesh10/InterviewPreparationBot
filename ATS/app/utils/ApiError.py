# utils/ApiError.py
class ApiError(Exception):
    def __init__(self, status_code, message="Something went wrong", errors=None, data=None):
        self.status_code = status_code
        self.message = message
        self.errors = errors if errors is not None else []
        self.success = False
        self.data = data if data is not None else {}

    def to_dict(self):
        """Converts the ApiError to a dictionary format for JSON response."""
        return {
            'status_code': self.status_code,
            'message': self.message,
            'errors': self.errors,
            'success': False,
            'data': self.data
        }
