import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Admin.module.css"; // 使用相同的样式文件

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  // 检查用户是否已登录
  /*useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("user") == "undefined") {
        router.push("/admin/login");
      } else {
        fetchUserData();
      }
    }
  }, [router]);*/

  // 获取用户信息和订单
  const fetchUserData = async () => {
    try {
      setPhoneNumber(userRes.data.phoneNumber);
      const orderRes = await axios.get(`/api/orders?customerId=${localStorage.getItem('user')}`);
      setOrders(orderRes.data);

      // 计算用户的总积分
      const points = orderRes.data.length; // 假设每个订单算1积分
      setTotalPoints(points);
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>User Dashboard</h1>
          <span className={styles.points}>Total Points: {totalPoints}</span>
          <button className={styles.logout} onClick={() => { localStorage.clear(); router.push("/"); }}>
            Logout
          </button>
        </div>

        <div className={styles.ordersContainer}>
          <h2>Order History for {phoneNumber}</h2>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.trTitle}>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </tbody>
            {orders.map((order) => (
              <tbody key={order._id}>
                <tr className={styles.trTitle}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${(order.total * 1.0625).toFixed(2)}</td>
                  <td>{order.status}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
