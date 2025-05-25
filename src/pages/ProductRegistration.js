import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Adjust the import based on your structure
import QRCode from 'qrcode.react';

const ProductRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    category: '',
    serial_number: '',
    quantity: 0,
    price: 0.00,
    product_image_url: '',
    low_stock: false,
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: formData.name,
          brand: formData.brand,
          model: formData.model,
          category: formData.category,
          serial_number: formData.serial_number,
          quantity: formData.quantity,
          price: formData.price,
          product_image_url: formData.product_image_url,
          low_stock: formData.low_stock,
        },
      ]);

    if (error) {
      console.error('Error inserting product:', error);
    } else {
      console.log('Product registered:', data);
     
      const generatedQrCodeUrl = `${data[0].serial_number}`; // You can customize the content as needed
      setQrCodeUrl(generatedQrCodeUrl);


      setFormData({
        name: '',
        brand: '',
        model: '',
        category: '',
        serial_number: '',
        quantity: 0,
        price: 0.00,
        product_image_url: '',
        low_stock: false,
      });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <h2>Product Registration</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Model:</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Serial Number:</label>
          <input
            type="text"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
          />
        </div>
        <div>
          <label>Product Image URL:</label>
          <input
            type="text"
            name="product_image_url"
            value={formData.product_image_url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Low Stock:</label>
          <input
            type="checkbox"
            name="low_stock"
            checked={formData.low_stock}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register Product</button>
      </form>

      {qrCodeUrl && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>Generated QR Code:</h3>
          <QRCode value={qrCodeUrl} />
        </div>
      )}
    </div>
  );
};

export default ProductRegistration;