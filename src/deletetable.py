import logging, boto3
from botocore.exceptions import ClientError
import uuid

# 初始化 DynamoDB 资源
dyndb = boto3.resource('dynamodb', region_name='us-east-1')

def delete_table():
    try:
        table = dyndb.Table('user')
        table.load()  # 尝试加载表格，以确认它确实存在
        response = table.delete()  # 删除表格
        table.meta.client.get_waiter('table_not_exists').wait(TableName='user')
        return "Table deleted successfully."
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            return "Table does not exist."
        else:
            return f"Unexpected error: {e}"

# 调用 delete_table 函数并打印结果
if __name__ == "__main__":
    result = delete_table()
    print(result)
