import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals.ts';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

// Components
import App from './App.tsx';
import Login from './login/Login.tsx';


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
