import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Table, Button, Pagination } from "react-bootstrap";
import axios from "axios";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, []);

  const settlePayment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/payments/${id}`, { status: "Completed" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(payments.map(payment => payment._id === id ? { ...payment, status: "Completed" } : payment));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const badgeColor = status === "Completed" ? "success" : "warning";
    return <span className={`badge bg-${badgeColor}`}>{status}</span>;
  };

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const currentPayments = payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <h1 className="fw-bold mb-4">Payments</h1>
        <div className="container-fluid">
          <div className="table-responsive border rounded border-warning p-3 shadow">
            <Table striped bordered hover className="text-center align-middle">
              <thead className="table-secondary">
                <tr>
                  <th>Order ID</th>
                  <th>Artist ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>#{payment.orderId}</td>
                    <td>{payment.artistId}</td>
                    <td>₹{payment.amount.toFixed(2)}</td>
                    <td>{getStatusBadge(payment.status)}</td>
                    <td>
                      {payment.status === "Pending" ? (
                        <Button variant="warning" size="sm" onClick={() => settlePayment(payment._id)}>Settle</Button>
                      ) : (
                        <Button variant="success" size="sm" disabled>Completed</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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

export default AdminPayments;