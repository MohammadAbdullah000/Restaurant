import React, { useState } from "react";
import { Link  } from "react-router-dom";
import style from './Dashboard.module.css'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Generate dummy data
  const generateData = () => {
    return Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: index % 2 === 0 ? "Admin" : "User",
      status: index % 3 === 0 ? "Active" : "Inactive",
      createdAt: new Date().toISOString().split("T")[0],
    }));
  };

  const [data] = useState(generateData());

  // Filtered data based on search term
  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
    <div className={style.heading}>
    <div className={style.text}>
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Here you can manage your application effectively.</p>
    </div>
          <Link to='order'><button className={style.orderbtn}>Order</button></Link>
    </div>
    

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id}>
              <td style={styles.td}>{row.id}</td>
              <td style={styles.td}>{row.name}</td>
              <td style={styles.td}>{row.email}</td>
              <td style={styles.td}>{row.role}</td>
              <td style={styles.td}>{row.status}</td>
              <td style={styles.td}>{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No results found</p>
      )}
    </div>
  );
};

const styles = {
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f4f4f4",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
  },
};

export default Dashboard;
  