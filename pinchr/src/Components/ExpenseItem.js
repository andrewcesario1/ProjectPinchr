import React from "react";
import { TiDelete } from "react-icons/ti";

const ExpenseItem = (props) =>{
    return (
        <li className="list-group-item list-group-item-action list-group-item-dark d-flex justify-content-between align-items-center">
            {props.category}
            <div>
                <span className="badge rounded-pill bg-success mr-3">
                    ${props.amount}
                     </span>
                     <TiDelete size="1.5em"></TiDelete>
            </div>
        </li>
    )
}

export default ExpenseItem;