import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import '../styles/Dashboard.css';
import { PDFDocument, rgb } from 'pdf-lib';

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
  const [stockMovements, setStockMovements] = useState([]);

  const fetchData = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase.from('products').select('*');
      if (productsError) throw productsError;

      setTotalProducts(productsData.length);
      setLowStockItems(productsData.filter(item => item.quantity <= 5).length);
      setOutOfStockItems(productsData.filter(item => item.quantity === 0).length);
      setItems(productsData);
      setFilteredItems(productsData);

      const { data: suppliersData, error: suppliersError } = await supabase.from('suppliers').select('*');
      if (suppliersError) throw suppliersError;

      setSuppliers(suppliersData);
      setSuppliersCount(suppliersData.length);

      const low = productsData.some(item => item.quantity <= 5);
      const out = productsData.some(item => item.quantity === 0);
      setNotification(out ? 'Some items are out of stock!' : low ? 'Some items are low in stock!' : '');
    } catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockMovements = async () => {
    try {
      const { data: stockInData, error: inError } = await supabase.from('stock_in').select('*');
      const { data: stockOutData, error: outError } = await supabase.from('stock_out').select('*');
      if (inError || outError) throw new Error('Failed to fetch stock movements.');

      const stockInWithType = stockInData.map(item => ({ ...item, type: 'in' }));
      const stockOutWithType = stockOutData.map(item => ({ ...item, type: 'out' }));

      const combined = [...stockInWithType, ...stockOutWithType].sort((a, b) => new Date(b.date) - new Date(a.date));
      setStockMovements(combined);
    } catch (err) {
      console.error(err.message);
    }
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

  const handleSuppliersClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    let y = 750;

    const drawLine = () => {
      page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0, 0, 0) });
      y -= 10;
    };

    const newPage = () => {
      page = pdfDoc.addPage([600, 800]);
      y = 750;
    };

    const drawText = (text, size = 12) => {
      if (y < 50) newPage();
      page.drawText(text, { x: 50, y, size, color: rgb(0, 0, 0) });
      y -= 18;
    };

    drawText('Inventory Report', 20);
    drawLine();

    drawText('Inventory Items:', 16);
    drawText('Item Name | Category | Quantity | Low Stock');
    filteredItems.forEach(item => {
      drawText(`${item.name} | ${item.category} | ${item.quantity} | ${item.quantity <= 5 ? 'Yes' : 'No'}`);
    });

    y -= 10;
    drawLine();
    drawText('Stock Movements:', 16);
    drawText('Date | Product | Supplier | Quantity | Type');

    const sortedMovements = [...stockMovements].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedMovements.forEach(movement => {
      const productName = items.find(i => i.id === movement.product_id)?.name || 'Unknown Product';
      const supplierName = movement.supplier_id
        ? suppliers.find(s => s.id === movement.supplier_id)?.name || 'Unknown Supplier'
        : 'N/A';
      const type = movement.type === 'in' ? 'Added' : 'Removed';
      drawText(`${formatDate(movement.date)} | ${productName} | ${supplierName} | ${movement.quantity} | ${type}`);
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventory_report.pdf';
    link.click();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Inventory Management</h1>
        <div className="header-content">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={generatePDF} className="generate-report-button">Generate PDF Report</button>
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
        <div className="stat-card"><h3>Total Products</h3><p>{totalProducts}</p></div>
        <div className="stat-card low-stock"><h3>Low Stock</h3><p>{lowStockItems}</p></div>
        <div className="stat-card out-of-stock"><h3>Out of Stock</h3><p>{outOfStockItems}</p></div>
        <div className="stat-card" onClick={handleSuppliersClick} style={{ cursor: 'pointer' }}>
          <h3>Suppliers</h3><p>{suppliersCount}</p>
        </div>
      </div>

      <div className="stock-movements">
        <h3>Recent Stock Movements</h3>
        {stockMovements.length ? stockMovements.map((movement, idx) => {
          const productName = items.find(i => i.id === movement.product_id)?.name || 'Unknown';
          const supplierName = movement.supplier_id
            ? suppliers.find(s => s.id === movement.supplier_id)?.name
            : 'N/A';
          const typeText = movement.type === 'in' ? 'added' : 'removed';
          return (
            <div key={idx}>
              {formatDate(movement.date)}: {productName} (Supplier: {supplierName}) {typeText} {movement.quantity}
            </div>
          );
        }) : <div>No recent stock movements.</div>}
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
