import React from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path = '/' element={<Login />}/>
          <Route path = '/register' element={<Register />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
