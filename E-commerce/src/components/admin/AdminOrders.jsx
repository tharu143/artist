import React, { useEffect, useState } from 'react';
import { Table, Pagination, Badge } from 'react-bootstrap';
import Sidebar from './Sidebar';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching admin orders:", err);
      }
    };
    fetchOrders();
  }, []);

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
                      <td>#{order._id}</td>
                      <td>{order.customer || "Unknown Customer"}</td>
                      <td>{order.artistId || "Unknown Artist"}</td>
                      <td>{order.productId?.name || "Product Not Found"}</td> {/* Fix: Check if productId exists */}
                      <td>₹{order.total?.toFixed(2) || "N/A"}</td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <Badge bg={order.status === 'completed' ? 'success' : order.status === 'in_progress' ? 'primary' : 'warning'}>
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
                        </Badge>
                      </td>
                      <td>
                        {order.proofUrl ? (
                          <a href={order.proofUrl} target="_blank" rel="noopener noreferrer">View Proof</a>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;