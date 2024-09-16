from flask import Blueprint, request, jsonify
from src.services.user_service import get_user_profile, update_user_profile

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/profile', methods=['GET'])
def profile():
    user_id = request.args.get('user_id')
    response = get_user_profile(user_id)
    return jsonify(response)

@user_bp.route('/profile', methods=['PUT'])
def update_profile():
    data = request.get_json()
    response = update_user_profile(data)
    return jsonify(response)
