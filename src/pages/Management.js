import React, { useState, useEffect } from 'react';
import { supabase } from '../components/supabaseClient'; // Import your Supabase client
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead
import '../styles/StylesManagement.css'; // Ensure this CSS file is created
import { PackagePlus, UserPlus } from 'lucide-react'; // Import icons


const Management = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
  });
  const [suppliers, setSuppliers] = useState([]); // State to store suppliers

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      const { data, error } = await supabase.from('suppliers').select('*');
      if (error) {
        console.error('Error fetching suppliers:', error);
      } else {
        console.log('Fetched Suppliers:', data);
        setSuppliers(data);
      }
    };
    fetchSuppliers();
  }, []);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    setFormData({ name: '', contact: '', address: '' }); // Reset form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      const { data: updatedData, error: fetchError } = await supabase.from('suppliers').select('*');
      if (fetchError) {
        console.error('Error fetching suppliers after adding:', fetchError);
      } else {
        setSuppliers(updatedData); // Update suppliers state
      }
      toggleModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add supplier.');
    }
  };

  return (
    <div>
      <div className="supplier-list">
        <h2>Registered Suppliers</h2>
        <div className="supplier-cards">
          {suppliers.map((supplier) => (
            <div className="supplier-card" key={supplier.id}>
              <strong>{supplier.name}</strong>
              <p>Contact: {supplier.contact}</p>
              <p>Address: {supplier.address}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-container">
      <div className="card">
        <PackagePlus size={48} strokeWidth={2.5} className="icon" />
        <h4>Add Products</h4>
        <button className="btn" onClick={() => navigate('/stock-in')}>
          Go to Product Registration
        </button>
      </div>

      <div className="card">
        <UserPlus size={48} strokeWidth={2.5} className="icon" />
        <h4>Add Suppliers</h4>
        <button className="btn" onClick={toggleModal}>
          Add
        </button>
      </div>
    </div>
      
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>Supplier Registration</h2>
            <form onSubmit={handleSupplierSubmit}>
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
              <button type="submit">Register Supplier</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;