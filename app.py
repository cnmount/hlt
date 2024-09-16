# app.py
import boto3
from flask import Flask, request, jsonify
from flask_cors import CORS
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr
from werkzeug.security import generate_password_hash,check_password_hash
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr
import uuid
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from models.user import User



app = Flask(__name__)
dyndb = boto3.resource('dynamodb', region_name='us-east-1')
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
CORS(app, resources={r"/user/profile": {"origins": "*", "methods": ["GET"]}})  # 明确允许 GET 方法
user_table = dyndb.Table('user')
app.config['JWT_SECRET_KEY'] = '010920'  
jwt = JWTManager(app)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    print("Received data:", data) 
    username = data.get('username')  
    password = data.get('password')  
    phone = data.get('phone') 
    email = data.get('email')       

    if not username or not phone or not password:
        return jsonify({"message": "Missing required fields"}), 400

    # 检查电话号码是否已被注册
    try:
        response = user_table.query(
            IndexName='PhoneIndex',
            KeyConditionExpression=Key('phone').eq(phone)
        )
        if response['Items']:
            return jsonify({"message": "Phone number already registered"}), 409
    except ClientError as e:
        return jsonify({"message": str(e)}), 500

    # 生成用户ID并加密密码
    user_id = str(uuid.uuid4())
    hashed_password = generate_password_hash(password)

    # 创建新用户
    try:
        user_table.put_item(
            Item={
                'id': user_id,
                'username': username,
                'phone': phone,
                'email': email,
                'password': hashed_password
            }
        )
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        app.logger.error(f'Error during registration: {str(e)}')
        response = jsonify({"message": "Internal Server Error"})
        response.status_code = 500
        return response
     
    
def create_table():
    try:
        table = dyndb.create_table(
            TableName='user',
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {'AttributeName': 'id', 'AttributeType': 'S'},
                {'AttributeName': 'email', 'AttributeType': 'S'},
                {'AttributeName': 'phone', 'AttributeType': 'S'}
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            },
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'PhoneIndex',
                    'KeySchema': [{'AttributeName': 'phone', 'KeyType': 'HASH'}],
                    'Projection': {'ProjectionType': 'ALL'},
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                },
                {
                    'IndexName': 'EmailIndex',
                    'KeySchema': [{'AttributeName': 'email', 'KeyType': 'HASH'}],
                    'Projection': {'ProjectionType': 'ALL'},
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ]
        )
        table.meta.client.get_waiter('table_exists').wait(TableName='user')
        print("Table created successfully.")
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print("Table already exists.")
        else:
            print(f"Unexpected error: {e}")


def check_table():
    try:
        table = dyndb.Table('user')
        table.load()
        print("Table exists.")
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            print("Table does not exist.")
            return False
        else:
            print(f"Unexpected error: {e}")
            return False

def get_user(username):
    table = dyndb.Table('user')
    try:
        response = table.scan(
            FilterExpression=Attr('username').eq(username)
        )
        return response['Items'][0] if response['Items'] else None
    except ClientError as e:
        print(f"Unexpected error: {e}")
        return None

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    print(f"Received login attempt with username: {username} and password: {password}")
    user = get_user(username)
    print('DB:', user['password'])
  
    if user:
        if (check_password_hash(user['password'],password)):
            print(f"apy. Login successful.")
            access_token = create_access_token(identity=user['id'])
            return jsonify(access_token=access_token), 200
            
        else:
            print(f"apy. Incorrect password.")
            return jsonify({"message": "Incorrect password."}), 401
    else:
        print(f"qpy. User does not exist.")
        return jsonify({"message": "User does not exist."}), 404

@app.route('/user/profile', methods=['GET'])
@jwt_required()
def user_profile():
    auth_header = request.headers.get('Authorization')
    print("Received Authorization Header:", auth_header)
    user_id = get_jwt_identity()
    print("Decoded JWT Identity:", user_id)
    if not user_id:
        return jsonify({'message': 'Unauthorized: No user ID found in token'}), 401

    user = User.get_user(user_id)
    if user:
        user_dict = user.to_dict()
        print("USER", user_dict)
        return jsonify(user_dict), 200
    else:
        return jsonify({'message': 'User not found'}), 404


if __name__ == '__main__':
    if not check_table():
     create_table()
app.run(debug=True)
