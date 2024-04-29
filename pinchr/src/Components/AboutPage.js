import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import '../Styles/about.css';
import Navbar from "./Navbar";

function AboutPage() {
    const navigate = useNavigate();
    const [authUser, setAuthUser] = useState(null);  // State to hold the authenticated user object

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see user object for details
                setAuthUser(user);
            } else {
                // User is signed out
                navigate('/signin');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);

    const userSignOut = () => {
        signOut(auth).then(() => {
            navigate('/signin');
        }).catch(error => console.log(error));
    };
    
    return (
        <div className="about-container">
            <Navbar />
            <div className="aboutInfo">
                <h1>About Program</h1>
                <p>Pinchr is an expense manager that is simple and lightweight.<br/>
                     Central to the design of the service is control and simplicity.<br/>
                     Pinchr does not require invasive bank APIs or other access to<br/>
                      sensitive financial data in order to function.<br/>
                     Users are put in control of their budgeting<br/>
                      and expense statements with simple tools that create a clear<br/>
                      overview of their financial journey. Users can enter their expenses,<br/>
                       give them tags and sort them into categories,<br/>
                        and see how their money is spent.<br/>
                        <br/>

                       They are able to create budgets and savings goals, <br/>
                       encouraging them to spend wisely <br/>
                       and save thoughtfully. With Pinchr, users are reminded <br/>
                       of their monthly recurring expenses, <br/>
                        build smart spending habits, categorize their spending <br/>
                        for easy monitoring, and stay on top <br/>
                        of their financial health with ease. <br/>
                </p>

                <h2>Future features and Update</h2>
                <p>- Users can input income. <br/>
                - Users will be able to view expenses in each budget plan. <br/>
                - Users will be able to search through expenses using key words. <br/>
                - Most bugs will be fixed throughout the program. <br/>


                </p>
            </div>
        </div>
    );
}

export default AboutPage;