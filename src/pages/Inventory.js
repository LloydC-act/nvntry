import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import { QRCodeSVG } from 'qrcode.react'; // Use QRCodeSVG for rendering
import '../styles/Table.css'; // Import the CSS for styling

const ItemList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null); // State to hold QR code data

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

  const handleQrCodeGeneration = (product) => {
    setQrCodeData(product.serial_number); // Set QR code data to the product's serial number
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="item-list-container">
      <h2>Products</h2>
      <table className="item-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Category</th>
            <th>Serial Number</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Image</th>
            <th>Receive On</th>
            <th>Low Stock</th>
            <th>QR Code</th> {/* New column for QR code */}
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.model}</td>
              <td>{product.category}</td>
              <td>{product.serial_number}</td>
              <td>{product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <img src={product.product_image_url} alt={product.name} className="item-image" />
              </td>
              <td>{new Date(product.receive_on).toLocaleDateString()}</td>
              <td>{product.quantity <= 5 ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleQrCodeGeneration(product)}>Generate QR Code</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* QR Code Display */}
      {qrCodeData && (
        <div className="qr-code-container">
          <h3>Generated QR Code</h3>
          <QRCodeSVG value={qrCodeData} size={128} /> {/* Display QR code */}
        </div>
      )}
    </div>
  );
};

export default ItemList;