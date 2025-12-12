import { useState } from "react";
import axios from "axios";

function App() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const API = "http://localhost:3001";

  // Fetch Items
  const fetchItems = async (token) => {
    try {
      const res = await axios.get(`${API}/api/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItemList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/register`, {
        name: userName,
        email: email,
        password: password,
      });
      alert("Registered! Now Login.");
    } catch (err) {
      console.log(err);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/login`, {
        name: userName,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);

      fetchItems(res.data.token);
    } catch (err) {
      console.log(err);
    }
  };

  // Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/items`,
        { name: itemName, quantity, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItemName("");
      setQuantity("");
      setPrice("");

      fetchItems(token);
    } catch (err) {
      console.log(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setItemList([]);
  };

  // Start Edit
  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditPrice(item.price);
  };

  // Save Edit
  const handleSaveEdit = async (itemId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/api/items/${itemId}`,
        { name: editName, quantity: editQuantity, price: editPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingId(null);
      setEditName("");
      setEditQuantity("");
      setEditPrice("");

      fetchItems(token);
    } catch (err) {
      console.log(err);
      alert("Error updating item");
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditQuantity("");
    setEditPrice("");
  };

  // Delete Item
  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(`${API}/api/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchItems(token);
      } catch (err) {
        console.log(err);
        alert("Error deleting item");
      }
    }
  };

  // If Not Logged In → Show Register & Login Forms
  if (!isLoggedIn) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <h1 className="text-center mb-5">Inventory Management System 👨‍💻</h1>

            <div className="row">
              {/* Register Card */}
              <div className="col-lg-6 mb-4">
                <div className="card shadow-lg h-100">
                  <div className="card-body p-4">
                    <h3 className="card-title text-center mb-4">Register</h3>
                    <form onSubmit={handleRegister}>
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your username"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        Register
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Login Card */}
              <div className="col-lg-6 mb-4">
                <div className="card shadow-lg h-100">
                  <div className="card-body p-4">
                    <h3 className="card-title text-center mb-4">Login</h3>
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your username"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If Logged In → Show Inventory Management UI
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 className="mb-0">Welcome, {userName}</h1>
            </div>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>

          {/* Add Product Section */}
          <div className="card shadow-lg mb-5">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Add Product</h3>
              <form onSubmit={handleAddItem}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter product name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-success w-100">
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Inventory List Section */}
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Your Inventory</h3>
              {itemList.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemList.map((item) => (
                        <tr key={item._id}>
                          {editingId === item._id ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={editQuantity}
                                  onChange={(e) => setEditQuantity(e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                />
                              </td>
                              <td>
                                <button
                                  onClick={() => handleSaveEdit(item._id)}
                                  className="btn btn-sm btn-success me-2"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="btn btn-sm btn-secondary"
                                >
                                  Cancel
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="fw-bold">{item.name}</td>
                              <td>
                                <span className="badge bg-info">{item.quantity} units</span>
                              </td>
                              <td>
                                <span className="badge bg-success">₹{item.price}</span>
                              </td>
                              <td>
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="btn btn-sm btn-primary me-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item._id)}
                                  className="btn btn-sm btn-danger"
                                >
                                  Delete
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle"></i> No products added yet. Add your first product above!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
