//import React from 'react';
//import ReactDOM from 'react-dom';
//import * as ReactDOMClient from 'react-dom/client';
import {createRoot} from 'react-dom/client';
import reportWebVitals from './reportWebVitals.ts';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

// Components
import App from './App.tsx';
import Login from './login/Login.tsx';
import SetNick from './login/SetNick.tsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<Login />} />
      <Route path='/login/setnick' element={<SetNick />} />
    </Routes>
  </BrowserRouter>,
);

reportWebVitals();
