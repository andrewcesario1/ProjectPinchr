import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import {v4 as uuidv4} from 'uuid';
import { auth, db } from '../firebase';
import { QueryCompositeFilterConstraint, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";



const AddExpense = ({ authUser, expenses }) =>
{
    const { dispatch } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [amount, setAmount] = useState("");
    const [isCategorySelected, setIsCategorySelected] = useState(null);

    const handleCategorySelection = (category, e) => {
         e.preventDefault();
         setSelectedCategory(category);
         setIsCategorySelected(true);
    }
    const categories = ["Food", "Entertainment", "Utilities", "Phone Bill"];

    const onSubmit = async (e) => {
        e.preventDefault();
        
        const expense = {
        id: uuidv4(),
        category: selectedCategory,
        amount: parseFloat(amount),
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
                createdAt: serverTimestamp(),
            });
            // Clear form fields after submission
            setSelectedCategory(null);
            setAmount("");
            setIsCategorySelected(false);
        } catch (error) {
            console.error("Error adding expense to Firestore: ", error);
            alert("Failed to add expense. Try again.");
        }
    };

    return(
             <form onSubmit={onSubmit}>
         <div className="row align-items-center">
                <div className="dropdown col-sm-2 mt-4">
                    <button class="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        {selectedCategory || "Select Category"} <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {categories.map(category => (
                        <li key={category}>
                            <a href="#" onClick={(e) => handleCategorySelection(category, e)}>{category}</a>
                        </li>
                        ))}
                    </ul>
                </div>
                {/*  <label htmlFor="category-name"className="mb-1">Category Name</label>
                 <input type="text" 
                 className="form-control" 
                 id="category-name" 
                 placeholder="Category"
                 value={category} onChange={(e)=>setCategory(e.target.value)}
                  required></input>*/}
             
             <div className="col-sm-5">
                 <label htmlFor="amount" className="mb-1">Amount</label>
                 <input type="text"
                  className="form-control" 
                  id="amount"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e)=>setAmount(e.target.value)}
                   required></input>
             </div>
             <div className="col-sm mt-4">
                 <button type="submit" className="btn btn-success" disabled={!isCategorySelected}>Submit</button>
             </div>
         </div>
     </form>

    );
};

export default AddExpense;