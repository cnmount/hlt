import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/Login.module.css";


const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  
  const router = useRouter();

  const url = 'http://localhost:3000';

  // if (cookie.token === process.env.TOKEN) {
  //   router.push('/admin')
  // }
  
  useEffect(() => {
	if (typeof window !== 'undefined') {
		localStorage.getItem('admin') === 'true' ? router.push('/admin') : null
		localStorage.getItem('user') != null ? router.push("/dashboard") : null
	}
  },[router]);
  
  const handleRegister = () => {
    router.push("/admin/register"); // 假设注册页面的路径是 /register
  };

  const handleClick = async () => {
    try {
      // alert(process.env.LOGIN_URL)
      // alert(process.env.ADMIN_USERNAME)
      // await axios.post(`/api/login`, {
      await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      if(username === 'admin'){
        localStorage.setItem('admin', 'true')
        router.push("/admin");
      }else{
        localStorage.setItem('user', '12')//todo
        router.push("/dashboard");
      }
      
    } catch (err) {
      alert(err)
      console.log(err)
      setError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Admin Dashboard</h1>
        <input
          placeholder="username"
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleClick} className={styles.button}>
          Sign In
        </button>
        {error && <span className={styles.error}>Wrong Credentials!</span>}
        {/* Register 按钮 */}
        <button onClick={handleRegister} className={styles.button}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;