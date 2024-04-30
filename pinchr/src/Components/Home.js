import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import {collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import ExpenseDB from './ExpenseDB';
import AddExpense from './AddExpense';
import { AppProvider } from '../Context/AppContext';
import Navbar from './Navbar';
import ExpenseContainer from './ExpenseContainer';
import "../Styles/home.css";

function Home() {
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
                const q = query(collection(db, "expenses"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
                const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
                    const expensesArray = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setExpenses(expensesArray);
                });
                return unsubscribeFirestore; // Unsubscribes from Firestore when the effect is cleaned up.
            } else {
                setAuthUser(null);
                setExpenses([]);
                navigate('/signin');
            }
        });
        return unsubscribeAuth; // Unsubscribes from Auth when the effect is cleaned up.
    }, [navigate]);
    

    return (
        
        <AppProvider>
            <Navbar />
        <div className="container">
            <h1 className="mt-3">Pinchr Expense Manager</h1>
            <div className="row mt-3">
                <h3 className="mt-3">Expenses List</h3>
                <div className="row mt-3">
                    {/*<div className="col-sm">*/}
                    <ExpenseContainer>
                        <ExpenseDB expenses={expenses}/>
                    </ExpenseContainer>
                    {/*</div>*/}
                </div>
                <h3 className="mt-3">Add Expense Info</h3>
                <div className="row mt-3">
                    <div className="col-sm">
                        <AddExpense authUser={authUser}/>
                    </div>
                </div>
                <div className='mb-5'>
                </div>
            </div>
        </div>
        </AppProvider>
    );    
}

export default Home;
