import React, {useContext} from "react";
import ExpenseItem from "./ExpenseItem";
import { AppContext } from "../Context/AppContext";

const ExpenseList = () => {
    const { expenses } = useContext(AppContext);
    return (
        <ul className="list-group">
            {expenses.map((expense) => (
                <ExpenseItem
                id = { expense.id }
                category = { expense.category }
                amount = { expense.amount }/>
            ))}
        </ul>
    );
};

export default ExpenseList;