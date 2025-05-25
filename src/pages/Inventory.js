import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';

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
    <div className="item-list-container">
      <h2>Products</h2>
      <div className="summary-container">
      </div>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;