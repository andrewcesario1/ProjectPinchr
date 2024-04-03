// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVHKyvZeyMrLAFMoDQcZT9OOadWz752RE",
  authDomain: "pinchr-13af6.firebaseapp.com",
  projectId: "pinchr-13af6",
  storageBucket: "pinchr-13af6.appspot.com",
  messagingSenderId: "599499441386",
  appId: "1:599499441386:web:7f169aa3c462c3329f0393"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };