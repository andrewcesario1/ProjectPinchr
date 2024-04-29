import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { getDocs, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import Navbar from './Navbar';
import "../Styles/graph.css";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import {ArcElement, Legend, Tooltip} from 'chart.js'
ChartJS.register(ArcElement, Legend, Tooltip);

export default function Graphs() {
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();
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
                // setSortedExpenses([{"Food" : 0}, {"Entertainment" : 0}, {"Utilities" : 0}, {"PhoneBill" : 0},
                //                    {"RentMortgage" : 0}, {"Insurance" : 0}, {"Repairs" : 0}, {"Misc" : 0}])
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

        const sortedExpenses = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;

            return acc;
        }, {});
        console.log(sortedExpenses);
        const expenseData = {
            labels: Object.keys(sortedExpenses),
            datasets: [
                {
                    label: "Expenses",
                    backgroundColor: [
                        'rgb(37, 119, 173)',
                        'rgb(14, 53, 78)',
                        'rgb(122, 191, 233)',
                        'rgb(6, 159, 255)',
                        'rgb(6, 43, 255)',
                        'rgb(111, 127, 216)',
                        'rgb(61, 77, 131)',
                        'rgb(75, 80, 94)'
                    ],
                    hoverBackgroundColor: [
                        'rgb(37, 119, 173)',
                        'rgb(14, 53, 78)',
                        'rgb(122, 191, 233)',
                        'rgb(6, 159, 255)',
                        'rgb(6, 43, 255)',
                        'rgb(111, 127, 216)',
                        'rgb(61, 77, 131)',
                        'rgb(75, 80, 94)'
                    ],
                    data: Object.values(sortedExpenses)
                    
                }
            ]
        }
        return (
            <div className='pageContainer'>
                <Navbar />
                <h1>Take a look at your expenses!</h1>
                <div className='graphData'>
                    <p className='graphDescription'>Amount Spent per Category</p>
                </div>
                <div className="graphContainer">
                    <Doughnut
                        data={expenseData}
                        options={{
                            plugins: {
                            title:{
                                display:true
                            },
                            legend:{
                                display:true,
                                position:'right'
                            }   
                        }
                    }}
                    />
                </div>
            </div>
        )
}