import React, { useContext } from "react";
import { AppContext } from '../Context/AppContext';

const AmountSpent = () =>{
    const { expenses } = useContext(AppContext);

    const totalAmount = expenses.reduce((total, curr_item)=>{
       return (total += curr_item.amount);
    }, 0);

    return(
        <div className="alert alert-info">
            <span>Amount Spent: ${Number(totalAmount).toFixed(2)}</span>
        </div>
    );
};

export default AmountSpent;