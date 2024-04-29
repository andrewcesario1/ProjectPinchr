import React from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import Profile from './Components/Profile';
import Budget from './Components/Budget';
import Graphs from './Components/GraphData';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path = '/' element={<Home />}/>
          <Route path = '/signin' element={<Login />}/>
          <Route path = '/register' exact element={<Register />}/>
          <Route path = '/profile' element={<Profile />}/>
          <Route path = '/budget' element={<Budget />}/>
          <Route path = '/analytics' element={<Graphs />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
