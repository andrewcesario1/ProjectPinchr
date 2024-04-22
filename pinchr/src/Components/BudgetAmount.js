import React, { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

const BudgetAmount = () => {
    const { budget } = useContext(AppContext);
    return(
        <div className="alert alert-secondary">
            <span>Budget Amount: ${Number(budget).toFixed(2)}</span>
        </div>
    )
}

export default BudgetAmount;