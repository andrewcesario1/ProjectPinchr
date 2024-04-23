import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import "../Styles/navbar.css";

// Navbar component

function Navbar() {
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
        
        <header class="navHeader">
            <nav className="navbar">
                <ul>
                    <li className="navl"><Link className="navHome" to="/">Home</Link></li>
                    <li className="navl"><Link className="nav-link" to="/profile">Profile</Link></li>
                    <li className="navl"><Link className="nav-link" to="/budget">Budgets</Link></li>   
                    <li className="navl"><Link className="nav-link" to="/profile">Placeholder</Link></li>
                    <li className="navl"><Link className="nav-link" to="/profile">Placeholder</Link></li>   
                </ul>
                <ul className="signout">                   
                    <li className="navl"><Link className="nav-signout" onClick={userSignOut} >Sign Out</Link></li>
                </ul>
            </nav>
        </header>
    );
}
 
export default Navbar;