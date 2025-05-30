import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../components/logo.png';
import { supabase } from '../components/supabaseClient'; // Import your Supabase client

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  };

  return (
    <div className="body">
      <div className="loginBox">
        <div className="logoContainer">
          <img src={logo} alt="Invento Logo" className="logo" />
        </div>
        <h2 className="welcomeText">Welcome👋</h2>
        <p className="subText">Please login here</p>
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
