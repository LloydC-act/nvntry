import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Adjust the import based on your setup
import { Doughnut } from 'react-chartjs-2';
import '../styles/ItemSummary.css';

const ItemSummary = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0); // State for low stock items
  const [salesData, setSalesData] = useState(0); // State for sales data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        const totalQty = data.reduce((acc, item) => acc + item.quantity, 0);
        const totalCount = data.length;
        const totalSales = data.reduce((acc, item) => acc + (item.price * item.quantity), 0); // Calculate total sales
        const lowStockCount = data.filter(item => item.low_stock).length; // Count low stock items
        
        setTotalQuantity(totalQty);
        setTotalItems(totalCount);
        setSalesData(totalSales);
        setLowStockItems(lowStockCount); // Set low stock count
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ['Total Sales', 'Total Items'],
    datasets: [
      {
        data: [salesData, totalQuantity], // Total sales and total items
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="summary-container">
      <div className="summary-card">
        <h3>Sales vs Total Items</h3>
        <Doughnut data={data} />
      </div>
      <div className="summary-card">
        <h3>Low Stock Products</h3>
        <p>{lowStockItems}</p>
      </div>
      <div className="summary-card">
        <h3>Total Number of Items</h3>
        <p>{totalItems}</p>
      </div>
    </div>
  );
};

export default ItemSummary;