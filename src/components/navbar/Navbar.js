import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import SearchBar from '../common/searchBar/SearchBar';

/**
 * Navbar component displays the application header.
 * - Shows logo, search bar, navigation links, and logout button.
 * - Displays admin links if the user is an admin.
 */
const Navbar = () => {
  // State to track login and admin status
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');

  /**
   * useEffect to check login and admin status from localStorage on mount.
   */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'ADMIN');
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  /**
   * Handles user logout by clearing localStorage and redirecting to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  /**
   * Handles search form submission.
   * Navigates to the products page with the search query.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <AppBar position="static" className="navbar-appbar">
      <Toolbar className="navbar-toolbar">
        {/* Logo and App Name */}
        <IconButton edge="start" color="inherit" component={Link} to="/">
          <ShoppingCartIcon />
        </IconButton>
        <span className="navbar-logo">upGrad Eshop</span>
        <div className="navbar-spacer" />
        {/* Conditional rendering based on login status */}
        {!isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Signup</Button>
          </>
        ) : (
          <>
            {/* Search bar for logged-in users */}
            <SearchBar
              value={search}
              onChange={e => setSearch(e.target.value)}
              onSubmit={handleSearch}
            />
            <Button color="inherit" component={Link} to="/">Home</Button>
            {/* Add Product link for admin users */}
            {isAdmin && (
              <Button color="inherit" component={Link} to="/add-product">Add Products</Button>
            )}
            {/* Logout button */}
            <Button color="error" variant="contained" onClick={handleLogout} sx={{ ml: 2 }}>
              LOGOUT
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 