import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import { onAuthStateChanged } from 'firebase/auth';
import "../Styles/budget.css"; // Make sure this path is correct

const Budget = () => {
    const [budgetName, setBudgetName] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [totalSpent, setTotalSpent] = useState(0);
    const [authUser, setAuthUser] = useState(null);
    const [budgetPlans, setBudgetPlans] = useState([]);
    const [selectedBudgetId, setSelectedBudgetId] = useState('');
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
                fetchBudgetPlans(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchBudgetPlans = async (uid) => {
        const q = query(collection(db, "budgets"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        setBudgetPlans(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const addBudgetToFirestore = async () => {
        try {
            const docRef = await addDoc(collection(db, "budgets"), {
                uid: authUser.uid,
                budgetName,
                budgetAmount: parseFloat(budgetAmount),
                totalSpent: parseFloat(totalSpent),
                createdAt: serverTimestamp()
            });
    
            // Create a new budget object with the data from the form and the new doc ID
            const newBudget = {
                id: docRef.id,
                uid: authUser.uid,
                budgetName,
                budgetAmount: parseFloat(budgetAmount),
                totalSpent: parseFloat(totalSpent),
                createdAt: new Date()
            };
    
            // Update the budgetPlans state to include the new budget
            setBudgetPlans([...budgetPlans, newBudget]);
    
            // Reset form fields after successful submission
            setBudgetName('');
            setBudgetAmount('');
            setTotalSpent(0);
            
            // Optional: Select the new budget in the dropdown
            setSelectedBudgetId(docRef.id);
    
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to add budget');
        }
    };
    

    const getProgressBarColor = (totalSpent, budgetAmount) => {
        const percentage = totalSpent / budgetAmount;
        if (percentage < 0.5) return 'green'; // Less than 50% spent
        if (percentage < 0.75) return 'yellow'; // Between 50% and 75% spent
        if (percentage < 1) return 'orange'; // Between 75% and 100% spent
        return 'red'; // Over budget
      };

      const handleBudgetAmountChange = (e) => {
        const value = e.target.value ? parseFloat(e.target.value) : 0;
        setBudgetAmount(value);
        // Validate budget amount is greater than 0
        if (value <= 0) {
            setInputError("Budget Amount has to be greater than 0");
        } else if (totalSpent > value) {
            setInputError("Total Spent can't be larger than Budget Amount");
        } else {
            setInputError('');
        }
    };

    const handleTotalSpentChange = (e) => {
        const value = e.target.value ? parseFloat(e.target.value) : 0;
        setTotalSpent(value);
        // Validate total spent against budget amount
        if (budgetAmount && value > budgetAmount) {
            setInputError("Total Spent can't be larger than Budget Amount");
        } else {
            setInputError('');
        }
    };

    const handleBudgetNameChange = (e) => {
        const newBudgetName = e.target.value;
        setBudgetName(newBudgetName);

        // Perform case-insensitive check on the budget name for uniqueness
        const budgetNameExists = budgetPlans.some(budget => 
            budget.budgetName.toLowerCase() === newBudgetName.toLowerCase()
        );

        if (budgetNameExists) {
            setInputError("Budget name already used");
        } else {
            setInputError('');
        }
    };
      

    const selectedBudget = budgetPlans.find(budget => budget.id === selectedBudgetId);
    const progressBarColor = selectedBudget ? getProgressBarColor(selectedBudget.totalSpent, selectedBudget.budgetAmount) : 'green';


    return (
        <div className="budgetPage">
        <Navbar />
        <h1 className="budgetHeader">Budgets</h1>
        <select className="budgetDropdown" onChange={(e) => setSelectedBudgetId(e.target.value)} value={selectedBudgetId}>
            <option value="">Select a Budget</option>
            {budgetPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>{plan.budgetName}</option>
            ))}
        </select>

        {selectedBudget && (
            <div className="budgetOverview">
                <h3>{selectedBudget.budgetName}</h3>
                <div>Amount: ${selectedBudget.budgetAmount}</div>
                <div>Spent: ${selectedBudget.totalSpent}</div>
                <div className="progressContainer">
                    <div className="progressBar" style={{
                        width: `${Math.min(selectedBudget.totalSpent / selectedBudget.budgetAmount, 1) * 100}%`,
                        backgroundColor: progressBarColor,
                    }} />
                </div>
            </div>
        )}

            <form className="budgetForm" onSubmit={(e) => {
                e.preventDefault();
                if (!inputError) {
                    addBudgetToFirestore();
                }
            }}>
                <div>
                    <label htmlFor="budgetName">Budget Name:</label>
                    <input
                        id="budgetName"
                        type="text"
                        value={budgetName}
                        onChange={handleBudgetNameChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="budgetAmount">Budget Amount:</label>
                    <input
                        id="budgetAmount"
                        type="number"
                        value={budgetAmount}
                        onChange={handleBudgetAmountChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="totalSpent">Total Spent (optional):</label>
                    <input
                        id="totalSpent"
                        type="number"
                        value={totalSpent}
                        onChange={handleTotalSpentChange}
                    /> 
                    {inputError && <p className="inputError">{inputError}</p>}
                </div>
                <button type="submit" disabled={inputError !== ''}>Add Budget</button>
            </form>
        </div>
    );
};

export default Budget;