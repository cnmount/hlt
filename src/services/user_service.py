from src.models.user import User

def get_user_profile(user_id):
    user = User.get_user(user_id)
    if user:
        return user
    return {'message': 'User not found'}

def update_user_profile(data):
    user_id = data.get('user_id')
    updated_data = data.get('updated_data')
    User.update_user(user_id, updated_data)
    return {'message': 'User updated successfully'}
