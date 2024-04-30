import React from 'react';
import ExpenseItem from './ExpenseItem'; // Make sure to import ExpenseItem component

const ExpenseDB = ({ expenses }) => {
    return (
        <div className="row mt-3">
            <div className="col-sm">
                <ul className="list-group">
                {expenses.map(expense => (
                    <ExpenseItem key={expense.id} expense={expense} />
                ))}
                </ul>
            </div>
        </div>
    );
};

export default ExpenseDB;
