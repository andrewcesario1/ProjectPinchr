import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import Navbar from './Navbar';
import "../Styles/home.css";

function Home() {
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();
    const [expense, setExpense] = useState('');
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user) {
                setAuthUser(user);
                const q = query(collection(db, "expenses"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const expensesArray = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setExpenses(expensesArray);
                });
                return unsubscribe;
            } else {
                navigate('/signin');
            }
        });

        return () => {
            listen();
        }
    }, [navigate]);

    const addExpense = async () => {
        if (!authUser) return;
        try {
            await addDoc(collection(db, "expenses"), {
                uid: authUser.uid,
                amount: parseFloat(expense),
                createdAt: serverTimestamp()
            });
            setExpense(''); 
        } catch (error) {
            console.error("Error adding expense: ", error);
            alert("Failed to add expense. Try again.");
        }
    };

    return (
        <div className="page">
            <Navbar />
            <div className="header">Pinchr Expense Manager</div>
            <div className="body">
                <p>Enter an expense below</p>
                <label> $<input 
                    id="expenseInput"
                    type="number" 
                    placeholder="Enter an expense"
                    value={expense}
                    onChange={(e) => setExpense(e.target.value)}
                    required />
                </label>
                <br /><br />
                <button onClick={addExpense}>Add Expense</button>
                <div>
                    <h2>Expenses</h2>
                    <ul>
                        {expenses.map(expense => (
                            <li key={expense.id}>${expense.amount}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );    
}

export default Home;
