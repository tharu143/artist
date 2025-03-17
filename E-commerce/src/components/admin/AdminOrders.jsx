import React, { useEffect, useState } from 'react';
import { Table, Pagination, Badge } from 'react-bootstrap';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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
        const res = await axios.get("http://localhost:5000/api/orders/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching admin orders:", err.response?.data);
        setError('Failed to load orders.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <h1 className="fw-bold mb-4">Admin Order Management</h1>
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
                        <th>Artist ID</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Proof</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map(order => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>{order.customer || "Unknown"}</td>
                          <td>{order.artistId?._id?.slice(-6) || "Unknown"}</td>
                          <td>{order.productId?.name || "N/A"}</td>
                          <td>₹{order.total?.toFixed(2) || "N/A"}</td>
                          <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
                          <td>
                            <Badge bg={order.status === 'completed' ? 'success' : order.status === 'in_progress' ? 'primary' : 'warning'}>
                              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
                            </Badge>
                          </td>
                          <td>
                            {order.proofUrl ? (
                              <a href={`http://localhost:5000${order.proofUrl}`} target="_blank" rel="noopener noreferrer">View Proof</a>
                            ) : (
                              <span className="text-muted">No Proof</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                      <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                      {[...Array(totalPages).keys()].map(num => (
                        <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
                          {num + 1}
                        </Pagination.Item>
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

export default AdminOrders;