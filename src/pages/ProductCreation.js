import React, { useState } from 'react';
import { supabase } from '../components/supabaseClient';
import '../styles/ProductCreation.css'; // Import CSS for styling

const ProductCreation = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    category: '',
    quantity: 0,
    price: 0.00,
    product_image_url: '',
  });

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
      .from('products')
      .insert([formData]);

    if (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    } else {
      console.log('Product added:', data);
      alert('Product created successfully!');
      setFormData({
        name: '',
        brand: '',
        model: '',
        category: '',
        quantity: 0,
        price: 0.00,
        product_image_url: '',
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Brand:</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Model:</label>
          <input type="text" name="model" value={formData.model} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" />
        </div>
        <div className="form-group">
          <label>Product Image URL:</label>
          <input type="text" name="product_image_url" value={formData.product_image_url} onChange={handleChange} />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default ProductCreation;