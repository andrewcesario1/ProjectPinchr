import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { addDoc, getDocs, collection, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import ExpenseDB from './ExpenseDB';
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
            <Navbar />
        <div className="container">
            <h1 className="mt-3">Pinchr Expense Manager</h1>
            <div className="row mt-3">
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
            </div>
        </div>
        </AppProvider>
    );    
}

export default Home;
