import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import {v4 as uuidv4} from 'uuid';


const AddExpense = () =>
{
    const { dispatch } = useContext(AppContext);
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        
        const expense = {
        id: uuidv4(),
        category: category,
        amount: parseFloat(amount),
        };

        dispatch({
            type: 'Add_Expense',
            payload: expense,
        });
    };

  


    return(
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-sm">
                    <label for="category-name"className="mb-1">Category Name</label>
                    <input type="text" 
                    className="form-control" 
                    id="category-name" 
                    value={category} onChange={(e)=>setCategory(e.target.value)}
                     required></input>
                </div>
                <div className="col-sm">
                    <label for="amount" className="mb-1">Amount</label>
                    <input type="text"
                     className="form-control" 
                     id="amount"
                     value={amount}
                     onChange={(e)=>setAmount(e.target.value)}
                      required></input>
                </div>
                <div className="col-sm mt-4">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </div>
        </form>
        
    )
}

export default AddExpense;