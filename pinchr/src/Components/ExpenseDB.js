import React from 'react';

const ExpenseDB  = ({ expenses }) => {
    return(
        <div className="row mt-3">
                    <div className="col-sm">
                    <ul className="list-group">
                    {expenses.map(expense => (
                    <li key ={expense.id} className="list-group-item list-group-item-action list-group-item-dark d-flex justify-content-between align-items-center">
                    <span>{expense.uid}</span>
                    {expense.category}
                     <div>
                    <span className="badge rounded-pill bg-success mr-3">
                    ${expense.amount}
                     </span>
                        </div>
                        </li>))};
                    </ul>
                    </div>
                </div>
    )
}

export default ExpenseDB;