import React, { useState,useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import style from "./Sidebar.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { UserContext } from "../../Contexts/UserContext.jsx";

const sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const { user } = useContext(UserContext);
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
        </ul>
      </aside>

      {/* Main Content */}
      <div className={style.mainContent}>
        <header>
          <button className={style.menuBtn} onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <h1>Welcome {user?.full_name || "User"}</h1>

        </header>
        <section className={style.content}>
          <Outlet />
          
        </section>
      </div>
    </div>
  );
};

export default sidebar;
