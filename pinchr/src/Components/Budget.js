import React, { useState, useEffect } from 'react';
import { db , auth} from '../firebase'; // Make sure this path is correct
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from './Navbar';
import "../Styles/budget.css"
import { onAuthStateChanged } from 'firebase/auth';



const Budget = () => {
    const [budgetName, setBudgetName] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [totalSpent, setTotalSpent] = useState(0); // Initialize to zero if it's calculated later
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user); // Set the authenticated user to state
            }
        });
    
        return () => unsubscribe(); // Cleanup subscription on component unmount
    }, []);

    const addBudgetToFirestore = async () => { 
        try {
            await addDoc(collection(db, "budgets"), {
                uid: authUser.uid,
                budgetName,
                budgetAmount: parseFloat(budgetAmount),
                totalSpent: parseFloat(totalSpent),
                createdAt: serverTimestamp()
            });
            // Reset form fields after successful submission
            setBudgetName('');
            setBudgetAmount('');
            setTotalSpent(0);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to add budget');
        }
    };
    
    
    
    return (
        <div className="budget">
            <Navbar />
            <h1>Budgets</h1>
            <form onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission behavior
                addBudgetToFirestore();
            }}>
                <div>
                    <label htmlFor="budgetName">Budget Name:</label>
                    <input
                        id="budgetName"
                        type="text"
                        value={budgetName}
                        onChange={(e) => setBudgetName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="budgetAmount">Budget Amount:</label>
                    <input
                        id="budgetAmount"
                        type="number"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="totalSpent">Total Spent (optional):</label>
                    <input
                        id="totalSpent"
                        type="number"
                        value={totalSpent}
                        onChange={(e) => setTotalSpent(e.target.value)}
                    />
                </div>
                <button type="submit">Add Budget</button>
            </form>
        </div>
    );
}
 
export default Budget;