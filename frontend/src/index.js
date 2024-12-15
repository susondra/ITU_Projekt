import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";


/*
autor: Ondřej Šustr (xsustro00)

pozůstatek z doby, kdy jsem pracoval mezi více stránkama, 
teď už jen ke vkložení React aplikace k elementu div#root v existujícím HTML dokumentu

*/

/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/Add' element={<Add />} />
    </Routes>
  </React.StrictMode >
);*/

/**/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


