import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import '../styles/Table.css';

const ItemList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeData, setQrCodeData] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

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
    setQrCodeData(prev => ({ ...prev, [product.id]: product.serial_number }));
  };

  const uploadQrCode = async (productId) => {
    const serialNumber = qrCodeData[productId];
    if (!serialNumber) return;

    const qrCodeElement = document.getElementById(`qr-code-${productId}`);
    const canvas = await html2canvas(qrCodeElement);
    const dataUrl = canvas.toDataURL('image/png');

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`qr-${serialNumber}.png`, dataUrl.split(',')[1], {
        contentType: 'image/png',
      });

    if (error) {
      console.error('Error uploading QR code:', error);
    } else {
      const qrCodeUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/product-images/${data.path}`;
      await updateProductWithQrCodeUrl(productId, qrCodeUrl);
      console.log('QR code uploaded and URL updated:', qrCodeUrl);
    }
  };

  const updateProductWithQrCodeUrl = async (productId, qrCodeUrl) => {
    const { error } = await supabase
      .from('products')
      .update({ qr_code_url: qrCodeUrl })
      .eq('id', productId);

    if (error) {
      console.error('Error updating product QR code URL:', error);
    }
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
            <th>QR Code</th>
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
              <td>₱{product.price.toFixed(2)}</td>
              <td>
                <img src={product.product_image_url} alt={product.name} className="item-image" />
              </td>
              <td>{new Date(product.receive_on).toLocaleDateString()}</td>
              <td>{product.quantity <= 5 ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleQrCodeGeneration(product)}>Generate QR Code</button>
                {qrCodeData[product.id] && (
                  <div id={`qr-code-${product.id}`} className="qr-code-display">
                    <QRCodeSVG value={qrCodeData[product.id]} size={128} />
                    <button className="upload-qr-button" onClick={() => uploadQrCode(product.id)}>Upload QR Code</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;