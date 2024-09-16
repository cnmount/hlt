import axios from "axios";
import Head from "next/head";
import Featured from "../components/Featured";
import PizzaList from "../components/PizzaList";
// import AddButton from '../components/AddButton';
import styles from "../styles/Home.module.css";
// import AddProduct from '../components/AddProduct';
// import {useRouter} from 'next/router';

// ����AWS SDK
import AWS from 'aws-sdk';

// ����AWS SDK
AWS.config.update({ region: 'ap-southeast-2' });

// ��������������SNS Topic
async function createSNSTopic(topicName) {
  const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

  try {
    const createTopicParams = { Name: topicName };
    const data = await sns.createTopic(createTopicParams).promise();
    console.log(`SNS Topic created: ${data.TopicArn}`);
    return data.TopicArn; // ����Topic ARN
  } catch (err) {
    console.error('Error creating SNS Topic:', err);
    throw err; // �׳����󣬷����ϲ㺯������
  }
}

export default function Home({ pizzaList }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>SNACKS PIZZA - Order Online</title>
        <meta
          name="description"
          content="Customize and order your favorite snacks!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Featured />
      {/* {admin && <AddButton setClose={setClose}/>} */}
      <PizzaList pizzaList={pizzaList} />
      {/* {!close && <AddProduct setClose={setClose} />} */}
    </div>
  );
}
// ������������Topic��Ӷ���
async function subscribeToTopic(topicArn, email) {
  const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

  const subscribeParams = {
    Protocol: 'email', // ʹ�õ����ʼ�Э��
    TopicArn: topicArn,
    Endpoint: email, // ���ĵĵ����ʼ���ַ
  };

  try {
    const subscriptionData = await sns.subscribe(subscribeParams).promise();
    console.log(`Subscription ARN: ${subscriptionData.SubscriptionArn}`);
    return subscriptionData.SubscriptionArn;
  } catch (err) {
    console.error('Error subscribing to SNS Topic:', err);
    throw err;
  }
}

// ����������������Ϣ��SNS Topic
async function publishToSNSTopic(topicArn, message) {
  const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

  const publishParams = {
    Message: message,
    TopicArn: topicArn,
  };

  try {
    const publishData = await sns.publish(publishParams).promise();
    console.log(`Message ID: ${publishData.MessageId}`);
    return publishData.MessageId;
  } catch (err) {
    console.error('Error publishing to SNS Topic:', err);
    throw err;
  }
}
export async function getStaticProps() {
  // Call independent method to create SNS
  const topicName = 'MySNSTopic';
  let topicArn;
  try {
    topicArn = await createSNSTopic(topicName);
    console.log(`Topic ARN: ${topicArn}`);
  } catch (error) {
    console.error('Failed to create SNS topic:', error);
  }

  // Send message to SNS Topic
  const message = 'Hello! your have a new order.';
  try {
    await publishToSNSTopic(topicArn, message);
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Failed to send message:', error);
  }
	  
  try {
	  const url = process.env.NEXT_PUBLIC_API_URL;
	  const res = await axios.get(`${url}/api/products`);

	  return {
		props: {
		  pizzaList: res.data.products,
		},
	  };
  } catch (error) {
    console.error('Error fetching data:', error);
	return {
	  props: {
	    products: [],
	  },
	};
  }
}
