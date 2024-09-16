import boto3
from botocore.exceptions import NoCredentialsError

DYNAMODB = boto3.resource('dynamodb', region_name='us-west-2')
USERS_TABLE = DYNAMODB.Table('users')

def create_tables():
    try:
        DYNAMODB.create_table(
            TableName='users',
            KeySchema=[
                {'AttributeName': 'user_id', 'KeyType': 'HASH'},
            ],
            AttributeDefinitions=[
                {'AttributeName': 'user_id', 'AttributeType': 'S'},
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10,
            }
        )
    except NoCredentialsError:
        print("Credentials not available")
