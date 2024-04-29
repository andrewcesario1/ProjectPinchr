import React from 'react';
import { TiDelete } from "react-icons/ti";
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ExpenseDB  = ({ expenses }) => {

    const handleDeleteExpense = async (expenseID, e) =>{
        e.preventDefault();

        try{
         await deleteDoc(doc(db, "expenses", expenseID));
        } catch (error){
            console.error("Error deleting expense:", error);
        }
    }

    return(
        <div className="row mt-3">
                    <div className="col-sm">
                    <ul className="list-group">
                    {expenses.map(expense => (
                    <li key ={expense.id} className="list-group-item list-group-item-action list-group-item-dark d-flex justify-content-between align-items-center">
                    {expense.category}
                     <div>
                    <span className="badge rounded-pill bg-success mr-3">
                    ${parseFloat(expense.amount).toFixed(2)}
                     </span>
                     <TiDelete size="1.5em" onClick={(e) => handleDeleteExpense(expense.id, e)}></TiDelete>
                        </div>
                        </li>))}
                    </ul>
                    </div>
                </div>
    )
}

export default ExpenseDB;