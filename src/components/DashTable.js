import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Adjust the import based on your setup
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/DashTable.css';

const DashTable = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('your_table_name') // Replace with your actual table name
          .select('id, name, model, amount, project, account'); // Specify the fields you want

        if (error) throw error;

        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (itemId) => {
    // Navigate to the inventory page with the item ID
    navigate(`/inventory/${itemId}`); // Adjust the route as necessary
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="item-list-container">
      <h2>Item List</h2>
      <table className="item-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Model</th>
            <th>Amount</th>
            <th>Project</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} onClick={() => handleRowClick(item.id)} style={{ cursor: 'pointer' }}>
              <td>{item.name}</td>
              <td>{item.model}</td>
              <td>{item.amount}</td>
              <td>{item.project}</td>
              <td>{item.account}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashTable;