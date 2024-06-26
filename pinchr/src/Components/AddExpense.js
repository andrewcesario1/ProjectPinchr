import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import {v4 as uuidv4} from 'uuid';
import {db } from '../firebase';
import { addDoc, collection, query, where, getDocs, serverTimestamp, updateDoc, increment, doc } from "firebase/firestore";


const AddExpense = ({ authUser, expenses }) => {
    const { dispatch } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [amount, setAmount] = useState("");
    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const [isPartOfBudget, setIsPartOfBudget] = useState(false);
    const [selectedBudgetPlan, setSelectedBudgetPlan] = useState("");
    const [selectedBudgetName, setSelectedBudgetName] = useState("");
    const [budgetPlans, setBudgetPlans] = useState([]);
    const [description, setDescription] = useState("");

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
            setSelectedBudgetPlan("");
            setSelectedBudgetName("");
        }
    };

    const handleBudgetSelection = (e) => {
        const selectedId = e.target.value;
        setSelectedBudgetPlan(selectedId);
        const selectedPlan = budgetPlans.find(plan => plan.id === selectedId);
        setSelectedBudgetName(selectedPlan ? selectedPlan.budgetName : "");
    };
    

    const categories = ["Food", "Entertainment", "Utilities", "Phone Bill", "Rent/Mortgage", "Insurance", "Repairs", "Miscellaneous", "Supplies"];

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
            const finalDescription = description.trim() ? description : "No description";
            // Add expense to Firestore
            await addDoc(collection(db, "expenses"), {
                uid: authUser.uid,
                category: selectedCategory,
                amount: parseFloat(amount),
                description: finalDescription,
                budgetPlanId: selectedBudgetPlan,
                budgetPlanName: selectedBudgetName,
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
            setDescription("");
            setIsCategorySelected(false);
            setIsPartOfBudget(false);
            setSelectedBudgetPlan("");
            setSelectedBudgetName("");
        } catch (error) {
            console.error("Error adding expense to Firestore: ", error);
            alert("Failed to add expense. Try again.");
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row align-items-center">
            <div className="col-sm-2 mb-1 mt-4">
                <div className="dropdown">
                    <button id="category"className="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
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
            </div>
             
                <div className="col-sm-5 mb-1">
                    <label htmlFor="amount">Amount</label>
                    <input type="text"
                        className="form-control" 
                        id="amount"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required>
                    </input>
                </div>
                
                <div className="col-sm-4 mb-1">
                    <label htmlFor="description">Description (optional)</label>
                    <input type="text"
                        className="form-control" 
                        id="description"
                        placeholder="Add a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}>
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
                            onChange={handleBudgetSelection}
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
