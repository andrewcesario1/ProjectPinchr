import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Profile() {
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
        <div className="profile">
            <h1>Profile</h1>
            <p>Email: {authUser?.email}</p>
            <button onClick={userSignOut}>Sign Out</button>
        </div>
    );
}

export default Profile;