import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul className="menu">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li>
          <Link to="/management">Management</Link>
        </li>
        <li>
          <Link to="/stock-in">Add Product</Link>
        </li>
        <li>
          <Link to="/product">New Product</Link>
        </li>     
      </ul>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;