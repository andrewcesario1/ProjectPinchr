import React, { useState } from 'react';
import '../Styles/index.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom"
import userIcon from '../Assets/userIcon.png'
import pwIcon from '../Assets/passwordIcon.png'
import emailIcon from '../Assets/emailIcon.png'


function  Login() {
  // State hooks for handling user inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const signIn = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Successful sign in, navigate to home or another appropriate route
      navigate('/')
    }).catch((error) => {
      // Handle different error types specifically or display a general error message
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password, please try again.');
      } else if (error.code === 'auth/user-disabled') {
        setError('This account has been disabled.');
      } else {
        setError('Failed to sign in: ' + error.message);
      }
    })
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
          {error && <div class= "loginError"><p style={{ color: 'red', marginTop: '10px' }}>{error}</p></div>}
          <a href="/register" id="register">Don't have an account? Register here.</a>
          </form>
      </div>
    </div>
  );
};

export default Login;
