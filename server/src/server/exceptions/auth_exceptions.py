from src.server.exceptions.base import AppException


class UserAlreadyExistsException(AppException):
    def __init__(self):
        super().__init__("User already exists", 409)


class InvalidCredentialsException(AppException):
    def __init__(self):
        super().__init__("Invalid email or password", 401)
        
class MissingFieldsException(AppException):
    def __init__(self):
        super().__init__("Name, email, and password are required", 400)


class InvalidRefreshTokenException(AppException):
    def __init__(self):
        super().__init__("Invalid or expired refresh token", 401)