import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Import your Supabase client
import '../styles/StylesManagement.css'; // Ensure this CSS file is created

const Management = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(true); // Track whether we're adding a supplier or stocks
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    stockName: '', // For stock registration
    stockModel: '', // For stock registration
    stockAmount: '' // For stock registration
  });

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    setFormData({ name: '', contact: '', address: '', stockName: '', stockModel: '', stockAmount: '' }); // Reset form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{ 
          name: formData.name, 
          contact: formData.contact, 
          address: formData.address 
        }]);

      if (error) throw error;

      alert('Supplier added successfully!');
      toggleModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add supplier.');
    }
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('stocks') // Replace with your actual stocks table name
        .insert([{
          name: formData.stockName,
          model: formData.stockModel,
          amount: formData.stockAmount,
          // Add additional fields if needed
        }]);

      if (error) throw error;

      alert('Stock added successfully!');
      toggleModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add stock.');
    }
  };

  return (
    <div>
      <div className="card-container">
        <div className="card">
          <img src="https://via.placeholder.com/100" alt="Add Stocks" />
          <h4>Add Stocks</h4>
          <button className="btn" onClick={() => { setIsAddingSupplier(false); toggleModal(); }}>Add</button>
        </div>
        <div className="card">
          <img src="https://via.placeholder.com/100" alt="Add Suppliers" />
          <h4>Add Suppliers</h4>
          <button className="btn" onClick={() => { setIsAddingSupplier(true); toggleModal(); }}>Add</button>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>{isAddingSupplier ? 'Supplier Registration' : 'Add Stocks'}</h2>
            <form onSubmit={isAddingSupplier ? handleSupplierSubmit : handleStockSubmit}>
              {isAddingSupplier ? (
                <>
                  <label>Name:</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                  <label>Contact:</label>
                  <input 
                    type="text" 
                    name="contact" 
                    value={formData.contact} 
                    onChange={handleChange} 
                  />
                  <label>Address:</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                  />
                </>
              ) : (
                <>
                  <label>Stock Name:</label>
                  <input 
                    type="text" 
                    name="stockName" 
                    value={formData.stockName} 
                    onChange={handleChange} 
                    required 
                  />
                  <label>Model:</label>
                  <input 
                    type="text" 
                    name="stockModel" 
                    value={formData.stockModel} 
                    onChange={handleChange} 
                    required 
                  />
                  <label>Amount:</label>
                  <input 
                    type="text" 
                    name="stockAmount" 
                    value={formData.stockAmount} 
                    onChange={handleChange} 
                    required 
                  />
                </>
              )}
              <button type="submit">{isAddingSupplier ? 'Register Supplier' : 'Add Stock'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;