import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, collection } from "firebase/firestore";
import Navbar from './Navbar';
import "../Styles/graph.css";
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);

export default function Graphs() {
    const [authUser, setAuthUser] = useState(null);
    const [expenses, setExpenses] = useState([]);
    // const [sortedExpenses, setSortedExpenses] = useState([{"Food" : 0}, {"Entertainment" : 0}, {"Utilities" : 0}, {"PhoneBill" : 0},
    // {"RentMortgage" : 0}, {"Insurance" : 0}, {"Repairs" : 0}, {"Misc" : 0}]);


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
        // let sortedExpenses = []
        // sortedExpenses = [{"Food" : 0}, {"Entertainment" : 0}, {"Utilities" : 0}, {"PhoneBill" : 0},
        // {"RentMortgage" : 0}, {"Insurance" : 0}, {"Repairs" : 0}, {"Misc" : 0}]
        // {expenses.map(expense => (
        //     sortedExpenses[expense.category] += expense.amount
        // ))};
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
                    <div className='labels'>
                        <div className='label' id='l1'>
                            <p>Food</p>
                            <p>${parseFloat(sortedExpenses.Food).toFixed(2)}</p>
                        </div>
                        <div className='label' id='l2'>
                            <p>Entertainment</p>
                            <p>${parseFloat(sortedExpenses.Entertainment).toFixed(2)}</p>
                        </div>
                        <div className='label' id='l3'>
                            <p>Utilities</p>
                            <p>${parseFloat(sortedExpenses.Utilities).toFixed(2)}</p>
                        </div>
                        <div className='label' id='l4'>
                            <p>Phone Bill</p>
                            <p>${parseFloat(sortedExpenses.PhoneBill).toFixed(2)}</p>
                        </div>
                        <div className='label' id='l5'>
                            <p>Rent/Mortgage</p>
                            <p>${parseFloat(sortedExpenses.RentMortgage).toFixed(2)}</p>
                        </div>
                        <div className='label' id='l6'>
                            <p>Insurace</p>
                            <p>${parseFloat(sortedExpenses.Insurance).toFixed(2)}</p>
                        </div>
                        <div className='label' id='l7'>
                            <p>Repairs</p>
                            <p>${parseFloat(sortedExpenses.Repairs).toFixed(2)}</p>
                        </div>
                        <div className='label' id='l8'>
                            <p>Misc.</p>
                            <p>${parseFloat(sortedExpenses.Misc).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="graphContainer">
                    <Doughnut
                        data={expenseData}
                        options={{
                            plugins: {
                            title:{
                                display:true,
                                text:'Amount Spent per category',
                                fontSize:20
                            },
                            legend:{
                                display:true,
                                position:'right'
                            }
                        }}}
                    />
                </div>
            </div>
        )
}