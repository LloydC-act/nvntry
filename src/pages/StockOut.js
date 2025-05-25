import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient'; // Adjust the import based on your structure
import '../styles/StockOut.css'; // Import CSS for styling

const StockOut = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1,
    scanned_code: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('stock_out')
      .insert([formData]);

    if (error) {
      console.error('Error recording stock out:', error);
      alert('Failed to record stock out.');
    } else {
      console.log('Stock Out recorded:', data);
      alert('Stock out recorded successfully!');
      setFormData({
        product_id: '',
        quantity: 1,
        scanned_code: '',
      });
    }
  };

  return (
    <div className="container">
      <h2>Record Stock Out</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product:</label>
          <select name="product_id" value={formData.product_id} onChange={handleChange} required>
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (ID: {product.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div>
          <label>Scanned Code:</label>
          <input
            type="text"
            name="scanned_code"
            value={formData.scanned_code}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Record Stock Out</button>
      </form>
    </div>
  );
};

export default StockOut;