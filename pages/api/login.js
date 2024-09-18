import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';

AWS.config.update({
  region: 'ap-southeast-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // 
      const params = {
        TableName: userTable,
        FilterExpression: '#username = :username',
        ExpressionAttributeNames: {
          '#username': 'username',
        },
        ExpressionAttributeValues: {
          ':username': username,
        },
      };

      const { Items } = await dynamodb.scan(params).promise();

      // 
      if (Items.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }

      const user = Items[0];

      // verify pwd
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      return res.status(200).json({ message: 'Login successful' });

    } catch (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
