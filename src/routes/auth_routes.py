from flask import Blueprint, request, jsonify
from src.services.auth_service import register_user, login_user

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    response = register_user(data)
    return jsonify(response)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    response = login_user(data)
    return jsonify(response)
