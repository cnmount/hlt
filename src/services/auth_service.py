from src.models.user import User
import uuid

def register_user(data):
    user_id = str(uuid.uuid4())
    user = User(user_id=user_id, **data)
    User.create_user(user)
    return {'message': 'User registered successfully'}

def login_user(data):
    username = data.get('username')
    password = data.get('password')
    user = User.get_user_by_username(username)
    if user and user.password == password:
        return {'message': 'Login successful', 'user': user.__dict__}
    return {'message': 'Invalid credentials'}
