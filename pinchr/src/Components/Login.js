import React from 'react';
import '../index.css'; 

function  Login() {
  return (
    <div>
      <div className="header">
        <h1>Pinchr</h1>
      </div>
      <div className="Login">
        <h2>Sign in</h2>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" placeholder="Enter Username" required /><br /><br />
        <label htmlFor="pass">Password:</label>
        <input type="password" id="pass" placeholder="Enter Password" required /><br /><br />
        <button id="loginbtn">Login</button><br /><br />
        <a href="/register" id="register">Don't have an account? Register here.</a>
      </div>
    </div>
  );
};

export default Login;
