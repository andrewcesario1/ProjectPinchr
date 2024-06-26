import React, { createContext, useReducer } from "react";
import { v4 as uuidv4 } from 'uuid';

const initState = {
    budget: 3000,
    expenses: [
        {id: uuidv4(), category: "shopping", amount: 300},
        {id: uuidv4(), category: "groceries", amount: 58},
        {id: uuidv4(), category: "car insurance", amount: 100},
        {id: uuidv4(), category: "medical bills", amount: 300},
    ]
}

const AppReducer = (state, action) => {
    switch(action.type)
    {
        case 'Add_Expense':
            return {
                //current state of the expenses
                ...state,
                //current state with the new expenses added at the end of the array
                expenses: [...state.expenses, action.payload],
            };
        case 'Delete_Expense':
            return {
                ...state,
                expenses: state.expenses.filter((expense) => expense.id !== action.payload
            ),

            };
        default: 
        return state;
    }
}

export const AppContext = createContext();

export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initState);

    return(<AppContext.Provider value={{
        budget: state.budget,
        expenses: state.expenses,
        dispatch,
    }}>
        {props.children}
    </AppContext.Provider>)
};