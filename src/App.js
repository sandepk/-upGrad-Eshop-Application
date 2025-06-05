import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
// Import your page components below
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Products from './components/products/Products';
import AddProduct from './components/addProduct/AddProduct';
// ... import other pages as needed

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/" element={<Navigate to="/products" />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
