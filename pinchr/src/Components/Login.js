import React, { useState } from 'react';
import '../index.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom"

function  Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const signIn = (e) => {
    e.preventDefault();
    console.log(auth); // Check if auth is defined
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log(userCredentials);
        // Navigate only after successful sign-in
        navigate('/');
      }).catch((error) => {
        console.log(error);
        // Optionally handle errors (e.g., wrong password, no internet) here
      });
  }
  return (
    <div className ="body">
      <div className="header">
        <h1>Pinchr</h1>
      </div>
      <div className="Login">
        <form onSubmit={signIn}>
          <h2>Log in to your Account</h2>
          <label htmlFor="Email">Email:</label>
          <input 
            id="Email"
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
          <br /><br />
          <label htmlFor="pass">Password:</label>
          <input
            id="pass"
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
          <br /><br />
          <button id="loginbtn" type="submit">Login</button>
          <br /><br />
          <a href="/register" id="register">Don't have an account? Register here.</a>
          </form>
      </div>
    </div>
  );
};

export default Login;
