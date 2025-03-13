import React, { useEffect, useState } from "react";
import { Table, Pagination } from "react-bootstrap";
import Sidebar from "./ArtistSidebar";
import axios from "axios";

const ArtistPayments = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 8;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/payments/artist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaymentRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, []);

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = paymentRequests.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(paymentRequests.length / paymentsPerPage);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Payments</h2>
        </div>
        <div className="card border-warning">
          <div className="card-body p-0">
            <Table striped hover>
              <thead className="bg-warning">
                <tr>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.length > 0 ? (
                  currentPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>#{payment.orderId}</td>
                      <td>₹{payment.amount}</td>
                      <td>
                        <span className={`badge bg-${payment.status === "Completed" ? "success" : "warning"}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">No payments found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
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
      </main>
    </div>
  );
};

export default ArtistPayments;