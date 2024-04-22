import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { addDoc, getDocs, collection, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import BudgetAmount from './BudgetAmount';
import RemainingAmount from './RemainingAmount';
import ExpenseDB from './ExpenseDB';
import AmountSpent from './AmountSpent';
import ExpenseList from './ExpenseList';
import AddExpense from './AddExpense';
import { AppProvider } from '../Context/AppContext';
import Navbar from './Navbar';
import "../Styles/home.css";

function Home() {
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();
    const [expense, setExpense] = useState('');
    const [category, setCategory] = useState('Miscellaneous');
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) =>{
            if(user){
                setAuthUser(user);
                fetchData(user);
            }
            else{
                setAuthUser(null);
                setExpenses([]);
            } 
        });
            return ()=> unsubscribe();
    }, []);

        const fetchData = async (user) =>{
            const q = collection(db, "expenses");
            const querySnapshot = await getDocs(q);
            const expensesArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setExpenses(expensesArray);

        };

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user) {
                setAuthUser(user);
                const q = query(collection(db, "expenses"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const expensesArray = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setExpenses(expensesArray);
                });
                return unsubscribe;
            } else {
                navigate('/signin');
            }
        });

        return () => {
            listen();
        }
    }, [navigate]);

    const addExpense = async () => {
        if (!authUser) return;
        try {
            await addDoc(collection(db, "expenses"), {
                uid: authUser.uid,
                amount: parseFloat(expense),
                expenseCategory: category,
                createdAt: serverTimestamp()
            });
            setExpense('');
            setCategory('Miscellaneous'); 
        } catch (error) {
            console.error("Error adding expense: ", error);
            alert("Failed to add expense. Try again.");
        }
    };

    return (
        
        <AppProvider>
            <div className="page">
            <Navbar />
            <div className="homeHeader">Pinchr Expense Manager</div>
            <div className="homeBody">
                <p>Enter an expense below</p>
                <div class="expenseInput">
                    <label> $<input 
                        id="expenseInput"
                        type="number" 
                        placeholder="Enter an expense"
                        value={expense}
                        onChange={(e) => setExpense(e.target.value)}
                        required />
                    </label>
                </div>
                <div class="categoryInput">
                    <label className='categoryLabel'> Category:</label>
                    <select id='categorySelect'
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required>
                        
                        <option value={"Miscellaneous"}>Miscellaneous</option>
                        <option value={"Food"}>Food</option>
                        <option value={"Entertainment"}>Entertainment</option>
                        <option value={"Insurance"}>Insurance</option>
                        <option value={"Mortgage/Rent"}>Mortgage/Rent</option>
                        <option value={"Car"}>Car</option>
                        <option value={"Phone Bill"}>Phone Bill</option>
                        <option value={"Utilities"}>Utilities</option>
                        <option value={"Repairs"}>Repairs</option>

                    </select>
                </div>
                <button onClick={addExpense}>Add Expense</button>
            </div>
            <div class="expenseDiv">
                <h2>Expenses</h2>
                <table>
                    <tr>
                        <th>Amount</th>
                        <th>Category</th>
                    </tr>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id}>
                                <td class="amount" key={expense.id}>${expense.amount}</td>
                                <td class="category" key={expense.id}>{expense.expenseCategory}</td>
                                {/* <td class="timestamp" key={expense.id}>Time{expense.CreatedAt}</td> */}
                            </tr>
                        ))}
                    </tbody>
                    
                </table>
            </div>
        </div>
        <div className="container">
            <h1 className="mt-3">Pinchr Expense Manager</h1>
            <div className="row mt-3">
                <div className="col-sm">
                    <BudgetAmount/>
                </div>
                <div className="col-sm">
                    <RemainingAmount/>
                </div>
                <div className="col-sm">
                    <AmountSpent/>
                </div>
                <h3 className="mt-3">Expenses List</h3>
                <div className="row mt-3">
                    <div className="col-sm">
                        <ExpenseList/>
                    </div>
                </div>
                <h3 className="mt-3">Add Expense Info</h3>
                <div className="row mt-3">
                    <div className="col-sm">
                        <AddExpense authUser={authUser}/>
                    </div>
                </div>
                <h3 className="row mt-3">Expense Database</h3>
                    <div className="row mt-3">
                        <div className="col-sm">
                            <ExpenseDB expenses={expenses}/>
                        </div>
                    </div>
                <h1>Profile</h1>
                <p>Email: {authUser?.email}</p>
                <p>Enter an expense below</p>
                <div class="expenseInput">
                    <label> $<input 
                        id="expenseInput"
                        type="number" 
                        placeholder="Enter an expense"
                        value={expense}
                        onChange={(e) => setExpense(e.target.value)}
                        required />
                    </label>
                </div>
                <button onClick={addExpense}>Add Expense</button>
            </div>
            <div class="expenseDiv">
                <h2>Expenses</h2>
                <table>
                    
                    {expenses.map(expense => (
                        <tr><td class="amount" key={expense.id}>${expense.amount}</td></tr>
                    ))}
                    
                </table>
            </div>
        </div>
        </AppProvider>
    );    
}

export default Home;
