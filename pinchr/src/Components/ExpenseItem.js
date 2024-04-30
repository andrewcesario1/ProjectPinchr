import React, { useState } from 'react';
import { TiDelete, TiArrowSortedDown, TiArrowSortedUp, TiTag } from "react-icons/ti";
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ExpenseItem = ({ expense }) => {
  const [isDescriptionShown, setIsDescriptionShown] = useState(false);

  const handleDeleteExpense = async (e) => {
    e.preventDefault();
    try {
      await deleteDoc(doc(db, "expenses", expense.id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }
  

  return (
    <>
      <li className="list-group-item list-group-item-action list-group-item-dark d-flex justify-content-between align-items-center">
        <span onClick={() => setIsDescriptionShown(!isDescriptionShown)}>
          {expense.category}
          {isDescriptionShown ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          {expense.budgetPlanId && expense.budgetPlanId !== "" && <TiTag style={{ color: 'green', marginLeft: '5px' }} title={expense.budgetPlanName} />}
        </span>
        <div className="expense-actions">
          <span className="badge rounded-pill bg-success mr-2">
            ${parseFloat(expense.amount).toFixed(2)}
          </span>
          <span className="text-muted date-span mr-2">
            {expense.createdAt?.toDate().toLocaleDateString("en-US")}
          </span>
          <TiDelete size="1.5em" onClick={handleDeleteExpense} />
        </div>
      </li>
      {isDescriptionShown && (
        <li className="list-group-item">
          <p className="mb-0" style={{ color: '#757575', fontSize: '0.9em' }}>Description: {expense.description}</p>
        </li>
      )}
    </>
  );
};

export default ExpenseItem;
