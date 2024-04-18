import React, { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

const RemainingAmount = () =>{
    const { expenses, budget } = useContext(AppContext);

    const totalExpenses = expenses.reduce((total, curr_item)=>{
        return (total += curr_item.amount);
    }, 0);

    const alertType = totalExpenses > budget ? "alert-danger" : "alert-success";

    return(
        <div className={`alert ${alertType}`}>
            <span>Remaining Amount: ${(budget - totalExpenses).toFixed(2)}</span>
            </div>
    );
};

export default RemainingAmount;