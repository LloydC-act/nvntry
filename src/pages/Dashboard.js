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

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    // Title
    page.drawText('Inventory Report', {
      x: 50,
      y: 750,
      size: 24,
      color: rgb(0, 0, 0),
    });

    // Draw a line
    page.drawLine({
      start: { x: 50, y: 740 },
      end: { x: 550, y: 740 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Inventory Items
    let yPosition = 700;
    const tableColumn = ["Item Name", "Category", "Quantity", "Low Stock"];
    page.drawText(tableColumn.join(' | '), { x: 50, y: yPosition, size: 12 });
    yPosition -= 20;

    filteredItems.forEach(item => {
      page.drawText(`${item.name} | ${item.category} | ${item.quantity} | ${item.quantity <= 5 ? 'Yes' : 'No'}`, {
        x: 50,
        y: yPosition,
        size: 12,
      });
      yPosition -= 20;
    });

    // Stock Movements
    yPosition -= 20;
    page.drawText('Stock Movements', {
      x: 50,
      y: yPosition,
      size: 18,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    const movementColumn = ["Date", "Product Name", "Supplier", "Quantity", "Type"];
    page.drawText(movementColumn.join(' | '), { x: 50, y: yPosition, size: 12 });
    yPosition -= 20;

    stockMovements.forEach(movement => {
      const productName = items.find(item => item.id === movement.product_id)?.name || 'Unknown Product';
      const supplierName = movement.supplier_id ? suppliers.find(supplier => supplier.id === movement.supplier_id)?.name : 'N/A';
      page.drawText(`${formatDate(movement.date)} | ${productName} | ${supplierName} | ${Math.abs(movement.quantity)} | ${movement.quantity > 0 ? 'Added' : 'Removed'}`, {
        x: 50,
        y: yPosition,
        size: 12,
      });
      yPosition -= 20;
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    // Trigger download
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
          <div className="search-container">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={generatePDF} className="generate-report-button">
            Generate PDF Report
          </button>
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