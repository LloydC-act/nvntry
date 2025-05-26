import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
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
  const [notification, setNotification] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [stockReport, setStockReport] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);

  const userName = "Jake"; // Replace with dynamic user data if available

  const fetchData = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      setTotalProducts(productsData.length);
      setLowStockItems(productsData.filter(item => item.quantity <= 5).length);
      setOutOfStockItems(productsData.filter(item => item.quantity === 0).length);
      setItems(productsData);
      setFilteredItems(productsData);

      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*');

      if (suppliersError) throw suppliersError;

      setSuppliersCount(suppliersData.length);

      if (productsData.some(item => item.quantity === 0)) {
        setNotification('Some items are out of stock!');
      } else if (productsData.some(item => item.quantity <= 5)) {
        setNotification('Some items are low in stock!');
      } else {
        setNotification('');
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockMovements = async () => {
    const { data: stockInData } = await supabase.from('stock_in').select('*');
    const { data: stockOutData } = await supabase.from('stock_out').select('*');
    setStockMovements([...stockInData, ...stockOutData].sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort by date
  };

  useEffect(() => {
    fetchData();
    fetchStockMovements();
  }, []);

  useEffect(() => {
    const results = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.quantity.toString().includes(searchTerm)
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  const handleSuppliersClick = async () => {
    const { data: suppliersData, error } = await supabase
      .from('suppliers')
      .select('*');
    
    if (error) {
      console.error('Error fetching suppliers:', error);
    } else {
      setSuppliers(suppliersData);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const addStock = async (productId, quantity, supplierId) => {
    const { data, error } = await supabase
      .from('stock_in')
      .insert([{ product_id: productId, quantity, supplier_id: supplierId }]);

    if (error) {
      console.error('Error adding stock:', error);
    } else {
      const product = items.find(item => item.id === productId);
      await supabase
        .from('products')
        .update({ quantity: product.quantity + quantity })
        .eq('id', productId);
      fetchData(); // Refresh data
      fetchStockMovements(); // Refresh stock movements
    }
  };

  const removeStock = async (productId, quantity) => {
    const { data, error } = await supabase
      .from('stock_out')
      .insert([{ product_id: productId, quantity }]);

    if (error) {
      console.error('Error removing stock:', error);
    } else {
      const product = items.find(item => item.id === productId);
      await supabase
        .from('products')
        .update({ quantity: product.quantity - quantity })
        .eq('id', productId);
      fetchData(); // Refresh data
      fetchStockMovements(); // Refresh stock movements
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Use 24-hour format
    });
  };

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
        <div className="stat-card" onClick={handleSuppliersClick} style={{ cursor: 'pointer' }}>
          <h3>Suppliers</h3>
          <p>{suppliersCount}</p>
        </div>
      </div>

      {/* Recent Stock Movements */}
      <div className="stock-movements">
        <h3>Recent Stock Movements</h3>
        <div>
          {stockMovements.length > 0 ? (
            stockMovements.map((movement, index) => {
              const productName = items.find(item => item.id === movement.product_id)?.name || 'Unknown Product';
              const supplierName = movement.supplier_id ? suppliers.find(supplier => supplier.id === movement.supplier_id)?.name : 'N/A';
              return (
                <div key={index}>
                  {formatDate(movement.date)}: {productName} (Supplier: {supplierName}) {movement.quantity > 0 ? 'added' : 'removed'} {Math.abs(movement.quantity)}
                </div>
              );
            })
          ) : (
            <div>No recent stock movements.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Suppliers List</h2>
            <ul>
              {suppliers.map(supplier => (
                <li key={supplier.id}>
                  <strong>{supplier.name}</strong><br />
                  Contact: {supplier.contact}<br />
                  Address: {supplier.address}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;