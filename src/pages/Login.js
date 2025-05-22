import React from 'react';
import '../styles/Login.css'

const Login = () => {

  return (
    <div className="container">
      <div className="loginBox">
        <div className="logoContainer">
          <img
            src="https://placehold.co/50x50"
            alt="Logo"
            className="logo"
          />
          <h1 className="logoText">Inventory</h1>
        </div>
        <h2 className="welcomeText">Welcome👋</h2>
        <p className="subText">Please login here</p>
        <input
          type="password"
          placeholder="Password"
          className="input"
        />
        <button 
          className="button" 
          
        >
          Login
        </button>
        <button 
          className="textButton" 
          
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Login;