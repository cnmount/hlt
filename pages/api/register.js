// pages/api/auth/register.js
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  region: 'ap-southeast-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamoDbRaw = new AWS.DynamoDB();
const userTable = 'user';

// 检查用户名和密码的正则表达式
const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;
// 允许符号的密码校验规则
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&.]{8,}$/;



// 检查并创建 DynamoDB 表的函数，仅在注册时使用
async function checkOrCreateTable() {
  const tableName = userTable;

  const params = {
    TableName: tableName,
  };

  try {
    await dynamoDbRaw.describeTable(params).promise();
    console.log(`Table "${tableName}" exists.`);
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      console.log(`Table "${tableName}" does not exist. Creating table...`);

      const createParams = {
        TableName: tableName,
        KeySchema: [
          { AttributeName: 'id', KeyType: 'HASH' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'phone', AttributeType: 'S' },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        GlobalSecondaryIndexes: [
          {
            IndexName: 'PhoneIndex',
            KeySchema: [
              { AttributeName: 'phone', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          },
        ],
      };

      await dynamoDbRaw.createTable(createParams).promise();
      console.log(`Table "${tableName}" created successfully.`);
    } else {
      console.error(`Error describing table: ${error.message}`);
      throw new Error('Failed to describe or create table.');
    }
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, phone } = req.body;

    // 如果用户名是 'admin'，跳过校验
    if (username !== 'admin') {
      // 校验用户名和密码
      if (!username || !phone || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Invalid username. It should be 3-30 characters long and can only contain letters, numbers, dots, or underscores.' });
      }

      if (!passwordRegex.test(password)) {
        
        return res.status(400).json({
          message: 'Password must be at least 8 characters long and include at least one letter and one number.',
        });
      }
    }

    try {
      await checkOrCreateTable();

      const params = {
        TableName: userTable,
        IndexName: 'PhoneIndex',
        KeyConditionExpression: '#phone = :phone',
        ExpressionAttributeNames: {
          '#phone': 'phone',
        },
        ExpressionAttributeValues: {
          ':phone': phone,
        },
      };

      const { Items } = await dynamodb.query(params).promise();

      if (Items.length > 0) {
        return res.status(409).json({ message: 'Phone number already registered' });
      }

      const userId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      const putParams = {
        TableName: userTable,
        Item: {
          id: userId,
          username,
          phone,
          password: hashedPassword,
        },
      };

      await dynamodb.put(putParams).promise();
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
