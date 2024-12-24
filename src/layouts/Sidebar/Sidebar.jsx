import React, { useState, useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import style from "./Sidebar.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { UserContext } from "../../Contexts/UserContext.jsx";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const { user } = useContext(UserContext);
  const location = useLocation(); // Get the current location

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Extract the last segment of the URL
  const getLastPathSegment = (path) => {
    const segments = path.split("/").filter(Boolean); // Split and remove empty segments
    return segments[segments.length - 1] || "Dashboard"; // Fallback to "Dashboard" if root
  };

  const lastSegment = getLastPathSegment(location.pathname);

  return (
    <div className={style.adminDashboard}>
      {/* Sidebar */}
      <aside className={`${style.sidebar} ${isSidebarOpen ? style.open : ""}`}>
        <div className={style.sidebarHeader}>
          <h3>Admin Panel</h3>
          <button className={style.closeBtn} onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <ul className={style.sidebarMenu}>
          <li>
            <Link to="" onClick={closeSidebar}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="inventory" onClick={closeSidebar}>
              <i className="fas fa-box"></i>
              <span>Inventory</span>
            </Link>
          </li>
          <li>
            <Link to="category" onClick={closeSidebar}>
              <i className="fas fa-box"></i>
              <span>Add Category</span>
            </Link>
          </li>
          <li>
            <Link to="dish" onClick={closeSidebar}>
              <i className="fas fa-box"></i>
              <span>Dish</span>
            </Link>
          </li>
          <li>
            <Link to="menu" onClick={closeSidebar}>
              <i className="fas fa-clipboard-list"></i>
              <span>Menu</span>
            </Link>
          </li>
          <li>
            <Link to="designation" onClick={closeSidebar}>
              <i className="fas fa-clipboard-list"></i>
              <span>Add Designation</span>
            </Link>
          </li>
          <li>
            <Link to="employee" onClick={closeSidebar}>
              <i className="fas fa-clipboard-list"></i>
              <span>Add Employee</span>
            </Link>
          </li>
          <li>
            <Link to="expense" onClick={closeSidebar}>
              <i className="fas fa-clipboard-list"></i>
              <span>Add Expense</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className={style.mainContent}>
        <header>
          <button className={style.menuBtn} onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <h2>{lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)} Section</h2>
        </header>
        <section className={style.content}>
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default Sidebar;
