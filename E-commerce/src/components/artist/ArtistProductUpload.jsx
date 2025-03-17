import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Upload } from 'lucide-react';
import Sidebar from './ArtistSidebar';
import axios from 'axios';

const ArtistProductUpload = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productFile, setProductFile] = useState(null);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert('Please log in first!');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    if (productFile) formData.append('image', productFile);
  
    try {
      await axios.post('http://localhost:5000/api/products', formData, { // Removed 'response'
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product posted successfully!');
      setProductName('');
      setProductPrice('');
      setProductFile(null);
    } catch (err) {
      console.error('Error:', err.response?.status, err.response?.data);
      alert(`Failed to upload product: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Product Management</h2>
        </div>
        <div className="card border-warning">
          <div className="card-body">
            <Form onSubmit={handleProductSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="border-warning"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  required
                  className="border-warning"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Product Image</Form.Label>
                <div className="border border-warning rounded p-4 text-center">
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,application/pdf" // Restrict to allowed types
                    onChange={(e) => setProductFile(e.target.files[0])}
                    className="d-none"
                    id="fileInput"
                  />
                  <Button as="label" htmlFor="fileInput" variant="outline-warning" className="w-100">
                    <Upload size={16} className="me-2" />
                    Upload Product Image (JPEG, PNG, PDF)
                  </Button>
                  {productFile && <div className="mt-2 text-muted small">{productFile.name}</div>}
                </div>
              </Form.Group>
              <Button variant="warning" type="submit" className="w-100">
                Submit Product
              </Button>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistProductUpload;