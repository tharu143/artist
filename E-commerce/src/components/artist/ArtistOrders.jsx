import React, { useEffect, useState } from 'react';
import { Form, Table, Button, Pagination } from 'react-bootstrap';
import { Upload } from 'lucide-react';
import Sidebar from "./ArtistSidebar";
import axios from 'axios';

const ArtistOrders = () => {
  const [orders, setOrders] = useState([]);
  const [proofs, setProofs] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/artist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const handleDownload = (imageUrl, orderId) => {
    const link = document.createElement('a');
    link.href = imageUrl;
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
      await axios.post(`http://localhost:5000/api/orders/${orderId}/proof`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setProofs({ ...proofs, [orderId]: URL.createObjectURL(file) });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      console.error(err);
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
                        <td>#{order._id}</td>
                        <td>{order.customer}</td>
                        <td>{order.productId.name}</td>
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
                        <td>₹{order.total}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Form.Select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className={`border-${order.status === 'completed' ? 'success' : 'warning'}`}>
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
                                <Button variant="outline-info" size="sm" onClick={() => document.getElementById(`proof-upload-${order._id}`).click()}>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistOrders;