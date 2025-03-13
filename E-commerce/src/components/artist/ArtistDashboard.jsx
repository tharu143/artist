import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CircleDollarSign, ShoppingCart } from "lucide-react";
import { Table } from "react-bootstrap";
import Sidebar from "./ArtistSidebar";
import axios from "axios";

const ArtistDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [overviewData] = useState([
    { name: "Jan", total: 2400 },
    { name: "Feb", total: 1398 },
    { name: "Mar", total: 9800 },
    { name: "Apr", total: 3908 },
    { name: "May", total: 4800 },
    { name: "Jun", total: 3800 },
    { name: "Jul", total: 4300 },
    { name: "Aug", total: 5300 },
    { name: "Sep", total: 4800 },
    { name: "Oct", total: 6000 },
    { name: "Nov", total: 4300 },
    { name: "Dec", total: 7800 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const ordersRes = await axios.get("http://localhost:5000/api/orders/artist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersRes.data);

        const paymentsRes = await axios.get("http://localhost:5000/api/payments/artist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const revenue = paymentsRes.data
          .filter(payment => payment.status === "Completed")
          .reduce((sum, payment) => sum + payment.amount, 0);
        setTotalRevenue(revenue);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 bg-light p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Artist Dashboard</h2>
        </div>
        <div className="row mb-4">
          <div className="col-md-6 col-lg-4 mb-3">
            <div className="card border-warning">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">Total Revenue</h5>
                  <CircleDollarSign size={20} className="text-warning" />
                </div>
                <h3 className="card-text">₹{totalRevenue.toFixed(2)}</h3>
                <small className="text-muted">Updated from Paid Payments</small>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-3">
            <div className="card border-warning">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">Total Orders</h5>
                  <ShoppingCart size={20} className="text-warning" />
                </div>
                <h3 className="card-text">{orders.length}</h3>
                <small className="text-muted">+{orders.length} new orders</small>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card border-warning">
              <div className="card-body">
                <h5 className="card-title mb-4">Sales Overview</h5>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overviewData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="total" stroke="#ffc107" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card border-warning">
              <div className="card-body">
                <h5 className="card-title mb-4">Recent Orders</h5>
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(-5).reverse().map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id}</td>
                          <td>{order.customer}</td>
                          <td>₹{order.total}</td>
                          <td>
                            <span className={`badge bg-${order.status === "completed" ? "success" : "warning"}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistDashboard;