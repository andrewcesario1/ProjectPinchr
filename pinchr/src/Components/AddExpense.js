import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import {v4 as uuidv4} from 'uuid';
import { auth, db } from '../firebase';
import { addDoc, collection, query, where, getDocs, serverTimestamp, updateDoc, increment, doc } from "firebase/firestore";

const AddExpense = ({ authUser, expenses }) => {
    const { dispatch } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [amount, setAmount] = useState("");
    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const [isPartOfBudget, setIsPartOfBudget] = useState(false);
    const [selectedBudgetPlan, setSelectedBudgetPlan] = useState("");
    const [budgetPlans, setBudgetPlans] = useState([]);

    useEffect(() => {
        const fetchBudgetPlans = async () => {
            if (authUser) {
                const q = query(collection(db, "budgets"), where("uid", "==", authUser.uid));
                const querySnapshot = await getDocs(q);
                const fetchedPlans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBudgetPlans(fetchedPlans);
            }
        };

        fetchBudgetPlans();
    }, [authUser]);

    const handleCategorySelection = (category, e) => {
        e.preventDefault();
        setSelectedCategory(category);
        setIsCategorySelected(true);
    };

    const handleBudgetCheckboxChange = () => {
        setIsPartOfBudget(!isPartOfBudget);
        if (isPartOfBudget) {
            setSelectedBudgetPlan(""); // Clear budget plan if checkbox is unchecked
        }
    };
    

    const categories = ["Food", "Entertainment", "Utilities", "Phone Bill", "Rent/Mortgage", "Insurance", "Repairs", "Miscellaneous"];

    const onSubmit = async (e) => {
        e.preventDefault();
        
        const expense = {
            id: uuidv4(),
            category: selectedCategory,
            amount: parseFloat(amount),
            budgetPlanId: selectedBudgetPlan, // ID of the selected budget plan
        };

        dispatch({
            type: 'Add_Expense',
            payload: expense,
        });

        try {
            // Add expense to Firestore
            await addDoc(collection(db, "expenses"), {
                uid: authUser.uid,
                category: selectedCategory,
                amount: parseFloat(amount),
                budgetPlanId: selectedBudgetPlan, // Firestore field for budget plan ID
                createdAt: serverTimestamp(),
            });

            // Update the totalSpent in the selected budget if part of a budget plan
            if (isPartOfBudget && selectedBudgetPlan) {
                const budgetRef = doc(db, "budgets", selectedBudgetPlan);
                await updateDoc(budgetRef, {
                    totalSpent: increment(parseFloat(amount))
                });
            }

            // Clear form fields after submission
            setSelectedCategory(null);
            setAmount("");
            setIsCategorySelected(false);
            setIsPartOfBudget(false);
            setSelectedBudgetPlan("");
        } catch (error) {
            console.error("Error adding expense to Firestore: ", error);
            alert("Failed to add expense. Try again.");
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row align-items-center">
                <div className="dropdown col-sm-2 mt-4">
                    <button className="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        {selectedCategory || "Select Category"} <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {categories.map(category => (
                        <li className="categoryCell"key={category}>
                            <a href="#" onClick={(e) => handleCategorySelection(category, e)}>{category}</a>
                        </li>
                        ))}
                    </ul>
                </div>
             
                <div className="col-sm-5">
                    <label htmlFor="amount" className="mb-1">Amount</label>
                    <input type="text"
                        className="form-control" 
                        id="amount"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required>
                    </input>
                </div>
                
                <div className="isBudget col-sm-3">
                <input type="checkbox" 
                checked={isPartOfBudget} 
                onChange={handleBudgetCheckboxChange} />

                    <p className="budget">Is this part of a budget plan?</p>
                    {isPartOfBudget && (
                        <select 
                            className="form-control mt-2" 
                            value={selectedBudgetPlan} 
                            onChange={(e) => setSelectedBudgetPlan(e.target.value)}
                            required>
                            <option value="">Select Budget Plan</option>
                            {budgetPlans.map(plan => (
                                <option key={plan.id} value={plan.id}>{plan.budgetName}</option>
                            ))}
                        </select>
                    )}
                </div>
                
                <div className="col-sm mt-4">
                <button type="submit" className="btn btn-success" 
                disabled={!isCategorySelected || (isPartOfBudget && !selectedBudgetPlan)}>
                Submit
                </button>
                </div>
            </div>
        </form>
    );
};

export default AddExpense;
