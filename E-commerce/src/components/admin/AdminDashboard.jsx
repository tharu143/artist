import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import axios from "axios";

const AdminDashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [activeArtists, setActiveArtists] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const ordersRes = await axios.get("http://localhost:5000/api/orders/admin", { headers: { Authorization: `Bearer ${token}` } });
        setTotalOrders(ordersRes.data.length);

        const artistsRes = await axios.get("http://localhost:5000/api/auth/artists", { headers: { Authorization: `Bearer ${token}` } });
        setActiveArtists(artistsRes.data.length);

        const paymentsRes = await axios.get("http://localhost:5000/api/payments", { headers: { Authorization: `Bearer ${token}` } });
        const pending = paymentsRes.data.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0);
        setPendingPayments(pending);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    renderChart();

    return () => {
      chartInstance.current?.destroy();
    };
  }, []);

  const renderChart = () => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [{
          label: "Sales",
          data: [120, 190, 300, 500, 250, 350, 400],
          borderColor: "#ffc107",
          backgroundColor: "rgba(255, 193, 7, 0.2)",
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#ffc107",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  };

  return (
    <div className="d-flex bg-light">
      <Sidebar />
      <main className="flex-grow-1 px-3 py-4">
        <h1 className="fw-bold mb-3">Dashboard</h1>
        <div className="container-fluid">
          <div className="row g-3 mb-3">
            {[
              { title: "Total Orders", value: totalOrders },
              { title: "Active Artists", value: activeArtists },
              { title: "Pending Payments", value: `₹${pendingPayments.toFixed(2)}` },
            ].map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="card shadow border-start border-warning p-3">
                  <h5 className="text-muted">{item.title}</h5>
                  <p className="fs-2 fw-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card shadow border-warning p-3">
            <h5 className="text-muted mb-3">Sales Overview</h5>
            <div className="w-100" style={{ height: "300px" }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;