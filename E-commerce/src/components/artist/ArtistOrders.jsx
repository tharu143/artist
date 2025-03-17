import React, { useEffect, useState } from 'react';
import { Form, Table, Button, Pagination } from 'react-bootstrap';
import { Upload } from 'lucide-react';
import Sidebar from "./ArtistSidebar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ArtistOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [proofs, setProofs] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/orders/artist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err.response?.data);
        setError('Failed to load orders.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleDownload = (imageUrl, orderId) => {
    const fullUrl = `http://localhost:5000${imageUrl}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.setAttribute('download', `order-${orderId}-image.jpg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event, orderId) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("proof", file);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:5000/api/orders/${orderId}/proof`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProofs({ ...proofs, [orderId]: `http://localhost:5000${res.data.proofUrl}` });
      alert("Proof uploaded successfully!");
    } catch (err) {
      console.error('Error uploading proof:', err.response?.data);
      alert(`Failed to upload proof: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.map(order => order._id === orderId ? res.data : order));
    } catch (err) {
      console.error('Error updating status:', err.response?.data);
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  const toggleDescription = (orderId) => {
    setExpandedDescriptions(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Order Management</h2>
        </div>
        <div className="card border-warning">
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {orders.length === 0 && !error ? (
              <p className="text-center">No orders found.</p>
            ) : (
              <>
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Picture</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Proof</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map(order => {
                        const isExpanded = expandedDescriptions[order._id];
                        const shortDescription = order.description?.length > 20 ? order.description.slice(0, 20) + "..." : order.description;

                        return (
                          <tr key={order._id}>
                            <td>#{order._id.slice(-6)}</td>
                            <td>{order.customer || "Unknown"}</td>
                            <td>{order.productId?.name || "N/A"}</td> {/* Safety check */}
                            <td>
                              {order.pictureUrl ? (
                                <Button variant="outline-primary" size="sm" onClick={() => handleDownload(order.pictureUrl, order._id)}>Download</Button>
                              ) : (
                                <span className="text-muted">No Image</span>
                              )}
                            </td>
                            <td>
                              {order.description?.length > 20 ? (
                                <>
                                  {isExpanded ? order.description : shortDescription}
                                  <Button variant="link" size="sm" onClick={() => toggleDescription(order._id)}>
                                    {isExpanded ? "Read Less" : "Read More"}
                                  </Button>
                                </>
                              ) : (
                                order.description || <span className="text-muted">No Description</span>
                              )}
                            </td>
                            <td>₹{order.total?.toFixed(2) || "N/A"}</td>
                            <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
                            <td>
                              <Form.Select
                                value={order.status || "pending"}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className={`border-${order.status === 'completed' ? 'success' : 'warning'}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </Form.Select>
                            </td>
                            <td>
                              {order.status === 'completed' && proofs[order._id] ? (
                                <Button variant="outline-warning" size="sm" onClick={() => window.open(proofs[order._id], '_blank')}>View Proof</Button>
                              ) : (
                                order.status === 'completed' && (
                                  <>
                                    <input type="file" accept="image/*" id={`proof-upload-${order._id}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, order._id)} />
                                    <Button variant="outline-info" size="sm" as="label" htmlFor={`proof-upload-${order._id}`}>
                                      <Upload size={16} className="me-1" />
                                      Add Proof
                                    </Button>
                                  </>
                                )
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                      <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                      {[...Array(totalPages).keys()].map(num => (
                        <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>{num + 1}</Pagination.Item>
                      ))}
                      <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistOrders;