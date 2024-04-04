import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom"
import '../index.css';


function Home() {
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user) {
                setAuthUser(user);
            } else {
                navigate('signin')
            }
        });

        return () => {
            listen();
        }
    }, []);

    const userSignOut = () => {
        signOut(auth).then(() => {
            navigate('/signin')
        }).catch(error => console.log(error))
    }

    return (
        <div className="page">
            <div className="header">Pinchr Expense Manager</div>
            <div className="body">
                <h1>Profile</h1>
                <p>Email: {authUser?.email}</p> {/* Safe access to email */}
                <button onClick={userSignOut}>Sign Out</button>
            </div>
        </div>
    );    
}

export default Home;