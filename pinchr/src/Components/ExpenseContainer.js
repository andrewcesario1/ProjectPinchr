import React from "react";

const ExpenseContainer = ({ children }) => {

    return( <div style={{ display: 'flex', 
    flexDirection: 'column',
    maxHeight: '400px',
    overflowY: 'auto',
    backgroundColor: 'white', 
    borderRadius: '8px'
    }}>
    { children }
    </div>
    );

};

export default ExpenseContainer;