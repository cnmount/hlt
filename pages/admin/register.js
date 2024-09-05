import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Login.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      await axios.post("/api/register", {
        username,
        password,
      });
      setSuccess(true);
      setError("");
      // 注册成功后跳转到登录页面
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Create an Account</h1>
        <input
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          placeholder="Confirm Password"
          type="password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleRegister} className={styles.button}>
          Register
        </button>
        {error && <span className={styles.error}>{error}</span>}
        {success && <span className={styles.success}>Registration successful! Redirecting...</span>}
      </div>
    </div>
  );
};

export default Register;
