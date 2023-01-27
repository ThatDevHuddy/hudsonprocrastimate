import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Day from './pages/Day';
import Week from './pages/Week';
import Tasks from './pages/Tasks';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Router>
    <App />

    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/day' element={<Day />} />
      <Route path='/week' element={<Week />} />
      <Route path='/tasks' element={<Tasks />} />
    </Routes>
  </Router>
);