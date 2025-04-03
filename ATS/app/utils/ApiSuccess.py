class ApiSuccess:
    def __init__(self, status_code, message="Request was successful", data=None):
        self.status_code = status_code
        self.message = message
        self.data = data if data is not None else {}

    def to_dict(self):
        """Converts the ApiSuccess to a dictionary format for JSON response."""
        return {
            'status_code': self.status_code,
            'message': self.message,
            'data': self.data,
            'success': True
        }
