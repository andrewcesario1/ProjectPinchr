import React from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Profile from './Components/Profile';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path = '/' element={<Home />}/>
          <Route path = '/signin' element={<Login />}/>
          <Route path = '/register' element={<Register />}/>
          <Route path = '/profile' element={<Profile />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
