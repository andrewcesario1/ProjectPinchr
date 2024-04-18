import React, { useContext } from "react";
import { TiDelete } from "react-icons/ti";
import { AppContext } from "../Context/AppContext";

const ExpenseItem = (props) =>{
    const { dispatch } = useContext(AppContext);

    const deleteExpense = () => {
        dispatch({
                type: 'Delete_Expense',
                payload: props.id,
        });
    };


    return (
        <li className="list-group-item list-group-item-action list-group-item-dark d-flex justify-content-between align-items-center">
            {props.category}
            <div>
                <span className="badge rounded-pill bg-success mr-3">
                    ${props.amount}
                     </span>
                     <TiDelete size="1.5em" onClick={deleteExpense}></TiDelete>
            </div>
        </li>
    )
}

export default ExpenseItem;