import React, { useState } from 'react';
import '../index.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase"

function  Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = (e) => {
    e.preventDefault();
    console.log(auth); // Check if auth is defined
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      console.log(userCredentials)
    }).catch((error) => {
      console.log(error)
    })
  }
  return (
    <div className ="body">
      <div className="header">
        <h1>Pinchr</h1>
      </div>
      <div className="Login">
        <form onSubmit={signUp}>
          <h2>Create an Account</h2>
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
          <button id="loginbtn" type="submit">Sign up</button>
          <br /><br />
          <a href="/signin" id="register">Have an account? Sign in here.</a>
          </form>
      </div>
    </div>
  );
};

export default Register;
