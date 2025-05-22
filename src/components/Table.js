import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Ensure you import your Supabase client
import QRCode from 'qrcode.react'; // Import the QRCode component

const ItemList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // Replace with your table name
          .select('*'); // Select all columns

        if (error) throw error;

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Category</th>
            <th>Serial Number</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Image</th>
            <th>QR Code</th>
            <th>Receive On</th>
            <th>Low Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.model}</td>
              <td>{product.category}</td>
              <td>{product.serial_number}</td>
              <td>{product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <img src={product.product_image_url} alt={product.name} style={{ width: '50px' }} />
              </td>
              <td>
                <QRCode 
                  value={product.serial_number} // Use serial number or any unique identifier
                  size={50} // Set size of the QR code
                  style={{ width: '50px', height: '50px' }} // Style for the QR code
                />
              </td>
              <td>{new Date(product.receive_on).toLocaleDateString()}</td>
              <td>{product.low_stock ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;