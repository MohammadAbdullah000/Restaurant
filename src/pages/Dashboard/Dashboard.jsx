import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUsers, FaUtensils, FaMoneyBillWave, FaMoneyCheckAlt, FaCalendarAlt, FaConciergeBell, FaHamburger } from "react-icons/fa";
import style from './Dashboard.module.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [empCount, setEmpCount] = useState('')
  const [desigCount, setDesigCount] = useState('')
  const [dishCatCount, setDishCatCount] = useState('')
  const [dishesCount, setDishCount] = useState('')

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
  useEffect(() => {
    // Fetch categories from API
    fetch("https://letzbim.com/Restaurent/UniqueNUmberFetchApi.php")
      .then((res) => res.json())
      .then((data) => {
        setEmpCount(data.EmpCounts);
        setDesigCount(data.DesigCounts);
        setDishCatCount(data.DishCatCounts);
        setDishCount(data.DishesCounts);

      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <div className={style.heading}>
        <div className={style.text}></div>
        <Link to="order">
          <button className={style.orderbtn}>Order</button>
        </Link>
      </div>

      <div className={`${style.maindashboard}  ${style.nunito500}`}>
        <div className={style.cards}>
          {/* Orders Card */}
          <div className={style.card}>
            <FaUsers className={style.icon} />
            <div className={style.text}>

              <h3>Designation</h3>
              <p>Total: {desigCount}</p>
            </div>
          </div>
          <div className={style.card}>
            <FaUsers className={style.icon} />
            <div className={style.text}>

              <h3>Employees</h3>
              <p>Total: {empCount}</p>
            </div>
          </div>

          {/* Customers Card */}
          <div className={style.card}>
            <FaConciergeBell className={style.icon} />
            <div className={style.text}>
              <h3>Categorys</h3>
              <p>Total: {dishCatCount}</p>
            </div>
          </div>

          {/* Menu Card */}
          <div className={style.card}>
            <FaHamburger className={style.icon} />
            <div className={style.text}>
              <h3>Dishes</h3>
              <p>Items: {dishesCount}</p>
            </div>
          </div>

          {/* Income Card */}
          {/* <div className={style.card}>
            <FaMoneyBillWave className={style.icon} />
            <div className={style.text}>
              <h3></h3>
              <p>Total: $5000</p>
            </div>
          </div> */}

          {/* Outcome Card */}
          {/* <div className={style.card}>
            <FaMoneyCheckAlt className={style.icon} />
            <div className={style.text}>
              <h3>Outcome</h3>
              <p>Total: $3000</p>
            </div>
          </div> */}

          {/* Reservations Card */}
          {/* <div className={style.card}>
            <FaCalendarAlt className={style.icon} />
            <div className={style.text}>
            <h3>Reservations</h3>
            <p>Total: 25</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
