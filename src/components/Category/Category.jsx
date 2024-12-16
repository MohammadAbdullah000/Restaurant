import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import style from './Category.module.css';

const Category = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [dishCategory, setDishCategory] = useState("");
  const [dishes, setDishes] = useState([]);

  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }

  function handleAddDish() {
    // Add the new dish to the dishes list
    setDishes([...dishes, { category: dishCategory }]);

    // Clear the input fields after adding
    setDishCategory("");
    toggleAddDish();
  }

  // Columns for the data table
  const columns = [
    {
      name: 'Category',
      selector: row => row.category,
      sortable: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        fontSize: '16px',
      },
    },
  };

  // Filtered dishes based on the search term
  const filteredDishes = dishes.filter(dish =>
    dish.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={style.nunito500}>
      <div className={style.heading}>
        <h2>Welcome to the Category Section</h2>
        <p>Here you can manage your Category.</p>

        <div className={style.addDish}>
          <button onClick={toggleAddDish}>Add New Category</button>
        </div>
      </div>
      {addDishIsOpen && (
        <div className={`${style.cardForm} ${addDishIsOpen ? style.animateOpen : ""}`}>
          <h3>Add New Category</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={style.formGroupdish}>
              <label htmlFor="dishCategory">Category Name:</label>
              <input
                type="text"
                id="dishCategory"
                value={dishCategory}
                onChange={(e) => setDishCategory(e.target.value)}
                required
              />
            </div>
            <div className={style.buttonGroup}>
              <button type="button" onClick={handleAddDish}>Add Category</button>
              <button type="button" onClick={toggleAddDish}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className={style.tableContainer}>
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="Search by Category Name..."
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
    </div>
  );
};

export default Category;
