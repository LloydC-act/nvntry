import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../components/haah.jfif'; // Import the logo image

const Login = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === 'admin') {
      setIsAuthenticated(true); // Set authentication to true
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      alert('Invalid password. Please try again.');
    }
  };

  return (
    <div className="body">
      <div className="loginBox">
        <div className="logoContainer">
          <img 
            src={logo} // Use the imported logo
            alt="Invento Logo" 
            className="logo" 
          />
          <h1 className="logoText">Invento</h1>
        </div>
        <h2 className="welcomeText">Welcome👋</h2>
        <p className="subText">Please login here</p>
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className="button" 
          onClick={handleLogin}
        >
          Login
        </button>
        <button className="textButton">
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Login;