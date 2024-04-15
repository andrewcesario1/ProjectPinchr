import React, { useState } from 'react';
import '../index.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom"
import userIcon from '../Assets/userIcon.png'
import pwIcon from '../Assets/passwordIcon.png'
import emailIcon from '../Assets/emailIcon.png'

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
          <h2 id = "registerHeader">Log In</h2>
          <div class="inputField">
            <img src={emailIcon} alt="user" />
            <input 
              id="Email"
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>
          <div class="inputField">
          <img src={pwIcon} alt="user" />
            <input
              id="pass"
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </div>
          <button id="loginbtn" type="submit">Login</button>
          <br /><br />
          <a href="/register" id="register">Don't have an account? Register here.</a>
          </form>
      </div>
    </div>
  );
};

export default Login;
