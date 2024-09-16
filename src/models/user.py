# user.py
import boto3
from boto3.dynamodb.conditions import Key

# 创建 DynamoDB 资源
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
USERS_TABLE = dynamodb.Table('user')

class User:
    def __init__(self, id, username, email, phone, password,  **kwargs):
        self.id = id
        self.username = username
        self.email = email
        self.phone = phone
        self.password = password
        self.__dict__.update(kwargs)
    
    def to_dict(self):
        # 返回所有相关字段的字典表示
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "password": self.password
        }
    
    @staticmethod
    def get_user(user_id):
        try:
            response = USERS_TABLE.get_item(Key={'id': user_id})
            print("DynamoDB Response:", response)
            if 'Item' in response:
                return User(**response['Item'])
            else:
                return None
        except Exception as e:
            print(f"Error fetching user: {e}")
            return None

    @staticmethod
    def create_user(user):
        try:
            USERS_TABLE.put_item(Item=user.__dict__)
            print("User created successfully")
        except Exception as e:
            print(f"Error creating user: {e}")

    @staticmethod
    def update_user(user_id, updated_data):
        try:
            expression = "set " + ", ".join(f"{k}=:{k}" for k in updated_data)
            values = {f":{k}": v for k, v in updated_data.items()}
            USERS_TABLE.update_item(
                Key={'id': user_id},
                UpdateExpression=expression,
                ExpressionAttributeValues=values
            )
            print("User updated successfully")
        except Exception as e:
            print(f"Error updating user: {e}")
