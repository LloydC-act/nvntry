import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient'; // Adjust the path as necessary
import '../styles/Dashboard.css'; 

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [outOfStockItems, setOutOfStockItems] = useState(0);
  const [suppliersCount, setSuppliersCount] = useState(0);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const userName = "Mathins"; // Replace with dynamic user data if available

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');

        if (productsError) throw productsError;

        setTotalProducts(productsData.length);
        setLowStockItems(productsData.filter(item => item.low_stock <= 5).length);
        setOutOfStockItems(productsData.filter(item => item.quantity === 0).length);
        setItems(productsData);
        setFilteredItems(productsData);

        const { data: suppliersData, error: suppliersError } = await supabase
          .from('suppliers')
          .select('*');

        if (suppliersError) throw suppliersError;

        setSuppliersCount(suppliersData.length);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Inventory Management</h1>
        <div className="header-content">
          <div className="greeting">
            <h2>Hello, {userName}</h2>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </header>
      <div className="table-section">
        <h2>Inventory Items</h2>
        <table className="item-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Low Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.quantity <= 5 ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            <div className="stats-container">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="stat-card low-stock">
          <h3>Low Stock</h3>
          <p>{lowStockItems}</p>
        </div>
        <div className="stat-card out-of-stock">
          <h3>Out of Stock</h3>
          <p>{outOfStockItems}</p>
        </div>
        <div className="stat-card">
          <h3>Suppliers</h3>
          <p>{suppliersCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;