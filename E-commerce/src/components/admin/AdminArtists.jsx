import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [newArtist, setNewArtist] = useState({ name: "", email: "", password: "" });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/artists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArtists(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArtists();
  }, []);

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const addArtist = async () => {
    if (!newArtist.name || !newArtist.email || !newArtist.password) {
      setError("All fields are required!");
      return;
    }
    if (!isValidEmail(newArtist.email)) {
      setError("Invalid Email Format!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/auth/register/artist", newArtist, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtists([...artists, res.data.user]);
      setNewArtist({ name: "", email: "", password: "" });
      setShowModal(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add artist!");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <h1 className="fw-bold mb-3">Artists</h1>
        <Table striped bordered hover>
          <thead className="table-secondary">
            <tr>
              <th>S.no</th>
              <th>Artist ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist, index) => (
              <tr key={artist._id}>
                <td>{index + 1}</td>
                <td>{artist._id}</td>
                <td>{artist.name}</td>
                <td>{artist.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button className="btn btn-warning" onClick={() => setShowModal(true)}>+ Add Artist</Button>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Artist</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter artist name" value={newArtist.name} onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={newArtist.email} onChange={(e) => setNewArtist({ ...newArtist, email: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={newArtist.password} onChange={(e) => setNewArtist({ ...newArtist, password: e.target.value })} />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={addArtist}>Add Artist</Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default AdminArtists;