import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import style from './Dish.module.css';

const Dish = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishQuantity, setDishQuantity] = useState("");
  const [dishes, setDishes] = useState([]);

  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }

  function handleAddDish() {
    // Add the new dish to the dishes list
    setDishes([...dishes, { name: dishName, price: dishPrice, quantity: dishQuantity }]);

    // Clear the input fields after adding
    setDishName("");
    setDishPrice("");
    setDishQuantity("");
    toggleAddDish();
  }

  // Columns for the data table
  const columns = [
    {
      name: 'Dish Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => row.price,
      sortable: true,
    },
    {
      name: 'Quantity',
      selector: row => row.quantity,
      sortable: true,
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        fontSize: '18px', // Increase font size for header cells
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        fontSize: '16px', // Increase font size for table cells
      },
    },
  };
  
  // Filtered dishes based on the search term
  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <div className={style.heading}>
      <h2>Welcome to the Dish Section</h2>
      <p>Here you can manage your Dishes.</p>

      <div className={style.addDish}>
        <button onClick={toggleAddDish}>Add New Dish</button>
      </div>
    </div>
      {addDishIsOpen && (
        <div className={`${style.cardForm} ${addDishIsOpen ? style.animateOpen : ""}`}>
          <h3>Add New Dish</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={style.formGroupdish}>
              <label htmlFor="dishName">Dish Name:</label>
              <input
                type="text"
                id="dishName"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                required
              />
            </div>
            <div className={style.formGroupdish}>
              <label htmlFor="dishPrice">Price:</label>
              <input
                type="number"
                id="dishPrice"
                value={dishPrice}
                onChange={(e) => setDishPrice(e.target.value)}
                required
              />
            </div>
            <div className={style.formGroupdish}>
              <label htmlFor="dishQuantity">Quantity:</label>
              <input
                type="number"
                id="dishQuantity"
                value={dishQuantity}
                onChange={(e) => setDishQuantity(e.target.value)}
                required
              />
            </div>
            <div className={style.buttonGroup}>
              <button type="button" onClick={handleAddDish}>Add Dish</button>
              <button type="button" onClick={toggleAddDish}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className={style.tableContainer}>
        <h3>Dish List</h3>
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="Search by Dish Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DataTable
  className={style.datatable}
  columns={columns}
  data={filteredDishes}
  pagination
  highlightOnHover
  customStyles={customStyles}
/>

      </div>
    </>
  );
};

export default Dish;
