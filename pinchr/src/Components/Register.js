import React, { useState } from 'react';
import '../index.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import userIcon from '../Assets/userIcon.png'
import pwIcon from '../Assets/passwordIcon.png'
import emailIcon from '../Assets/emailIcon.png'

function  Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user);  // Check the user object
        // Store the user's name in Firestore
        const userRef = doc(db, "users", user.uid);  // Points to firestore DB collection "Users", unique for UID
        setDoc(userRef, { // creates an entry in the collection
          name: name,  // Store the name
          email: email,  // Store the email
        }, { merge: true })  // Use merge to not overwrite existing fields eg. an entry already exists with just an email stored
          .then(() => {
            console.log("User data stored in Firestore");
            navigate('/signin');  // Navigate after storing the data
          })
          .catch((error) => {
            console.error("Error storing user data in Firestore", error);
          });
      }).catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className ="body">
      <div className="header">
        <h1>Pinchr</h1>
      </div>
      <div className="Login">
        <form onSubmit={signUp}>
          <h2 id = "registerHeader">Create an Account</h2>
          <div class="inputField">
            <img src={userIcon} alt="name"/>
            <input
              id="name"
              type="name" 
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required />
          </div>
          <div class="inputField">
            <img src={emailIcon} alt="email"/>
            <input 
              id="Email"
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>
          <div class="inputField">
            <img src={pwIcon} alt="password"/>
            <input
              id="pass"
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </div>
          <button id="loginbtn" type="submit">Sign up</button>
          <br /><br />
          <a href="/signin" id="register">Have an account? Sign in here.</a>
          </form>
      </div>
    </div>
  );
};

export default Register;
