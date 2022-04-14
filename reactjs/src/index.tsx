import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

// Components
import App from './App.tsx';
import Login from './login/Login.tsx';
import Signup from './signup/Signup.tsx';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

