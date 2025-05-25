import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import '../styles/StockIn.css'; // Import the CSS file

const StockIn = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    supplier_id: '',
    quantity: 1,
  });

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (error) {
      console.error('Error fetching suppliers:', error);
    } else {
      setSuppliers(data);
    }
  };

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
    const { product_id, supplier_id, quantity } = formData;

    const { data, error } = await supabase
      .from('stock_in')
      .insert([{ product_id, supplier_id, quantity }]);

    if (error) {
      console.error('Error adding stock in:', error);
      alert('Failed to add stock in.');
    } else {
      console.log('Stock In added:', data);
      alert('Stock in recorded successfully!');
      setFormData({
        product_id: '',
        supplier_id: '',
        quantity: 1,
      });
    }
  };

  return (
    <div className="body">
      <h2>Stock In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product:   </label>
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
          <label>Supplier:  </label>
          <select name="supplier_id" value={formData.supplier_id} onChange={handleChange} required>
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} (ID: {supplier.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantity:  </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <button type="submit">Record Stock In</button>
      </form>
    </div>
  );
};

export default StockIn;