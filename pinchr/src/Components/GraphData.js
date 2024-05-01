import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { getDocs, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import Navbar from './Navbar';
import "../Styles/graph.css";
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import {ArcElement, Legend, Tooltip} from 'chart.js'
ChartJS.register(ArcElement, Legend, Tooltip);

export default function Graphs() {
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [budgetPlans, setBudgetPlans] = useState([]);
    const [selectedBudgetPlan, setSelectedBudgetPlan] = useState("");
    const [selectedGraph, setSelectedGraph] = useState("");
    const [budgetExpenses, setBudgetExpenses] = useState([]);
    const [sortedExpenses, setSortedExpenses] = useState([]);


    useEffect(() => {
        const fetchBudgetPlans = async () => {
            if (authUser) {
                const q = query(collection(db, "budgets"), where("uid", "==", authUser.uid));
                const querySnapshot = await getDocs(q);
                const fetchedPlans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBudgetPlans(fetchedPlans);
            }
        };

        fetchBudgetPlans();
    }, [authUser]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
                const q = query(collection(db, "expenses"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
                const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
                    const expensesArray = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setExpenses(expensesArray);
                });
                return unsubscribeFirestore; // Unsubscribes from Firestore when the effect is cleaned up.
            } else {
                setAuthUser(null);
                setExpenses([]);
                navigate('/signin');
            }
        });
        return unsubscribeAuth; // Unsubscribes from Auth when the effect is cleaned up.
    }, [navigate]);
    


        
        const onSubmit = async (e) => {
            e.preventDefault();
            const filteredExpenses = expenses.filter(expense => 
                expense.budgetPlanId === selectedBudgetPlan || 
                (expense.budgetPlanId === "" && selectedBudgetPlan === "none")
            );
        
            const sortedExpensesData = filteredExpenses.reduce((acc, expense) => {
                acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                return acc;
            }, {});
        
            setBudgetExpenses(filteredExpenses);
            setSortedExpenses(sortedExpensesData);
        };

    
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

        const graphOptions = {
                plugins: {
                title:{
                    display:true
                },
                legend:{
                    display:true,
                    position:'right',
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                }   
            }
        };

        let GraphComponent;
        switch (selectedGraph) {
            case 'Doughnut':
                GraphComponent = <Doughnut data={expenseData} options={graphOptions} />;
                break;
            case 'Bar':
                GraphComponent = <Bar data={expenseData} options={graphOptions} />;
                break;
            case 'Pie':
                GraphComponent = <Pie data={expenseData} options={graphOptions} />;
                break;
            default:
                GraphComponent = null;
        }
    
        return (
            <form onSubmit={onSubmit}>
                <div className='pageContainer'>
                    <Navbar />
                    <h1>Take a look at your expenses!</h1>
                    <div className='selectDiv'>
                        <select 
                            className='budgetSelect' 
                            value={selectedBudgetPlan} 
                            onChange={(e) => setSelectedBudgetPlan(e.target.value)}
                            required>
                            <option value="">Select Budget Plan</option>
                            {budgetPlans.map(plan => (
                                <option key={plan.id} value={plan.id}>{plan.budgetName}</option>
                            ))}
                            <option value="none">None</option>
                        </select>
                        <select
                            className='graphSelect'
                            value={selectedGraph}
                            onChange={(e) => setSelectedGraph(e.target.value)}
                            required>
                            <option value="">Select Graph</option>
                            <option value='Doughnut'>Doughnut</option>
                            <option value='Pie'>Pie</option>
                            <option value='Bar'>Bar</option>
                        </select>
                        <button type="submit" className='btn btn-warning' style={{marginLeft: '10px'}}
                        disabled={!selectedBudgetPlan || !selectedGraph}>
                            Display
                        </button>
                    </div>
                    <div className='graphData'>
                        <p className='graphDescription'>Amount Spent per Category</p>
                    </div>
                    <div className="graphContainer">
                        {GraphComponent}
                    </div>
                </div>
            </form>
        )
}