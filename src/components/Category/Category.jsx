import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import style from './Category.module.css';

const Category = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishes, setDishes] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('https://letzbim.com/Restaurent/dish_categories_fetch_Api.php');
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data); // Log the API response to see its structure
  
          // Ensure data is an array
          if (Array.isArray(data)) {
            setDishes(data);
          } else {
            console.error('API did not return an array. Received:', data);
            setDishes([]); // Fallback to an empty array
          }
        } else {
          console.error('Failed to fetch categories:', response.statusText);
          setDishes([]); // Fallback to an empty array on failure
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setDishes([]); // Set to empty array on error
      }
    }
  
    fetchCategories();
  }, []);
  

  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }

  async function handleAddDish() {
    try {
      const response = await fetch('https://letzbim.com/Restaurent/dishes_create_Api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          dishname: dishName,
        }),
      });

      const result = await response.json();

      if (result.successmessage === 'success') {
        setDishes((prevDishes) => [
          ...prevDishes,
          { dishcat_name: dishName, dishcat_id: result.new_id },
        ]);
        setDishName('');
        toggleAddDish();
      }
      else {
        alert(result.message || 'Failed to add category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category.');
    }
  }

  // Handle delete category
  const handleDelete = async (dishId) => {
    try {
      const response = await fetch('https://letzbim.com/Restaurent/dish_category_delete_Api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          dishcat: dishId,
        }),
      });

      const result = await response.json();

      if (result.successmessage === 'success') {
        // Remove deleted dish from local state
        setDishes(dishes.filter((dish) => dish.dishcat_id !== dishId));
      } else {
        alert(result.message || 'Failed to delete category.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred while deleting the category.');
    }
  };

  // Columns for the data table
  const columns = [
    {
      name: 'Category Name',
      selector: (row) => row.dishcat_name,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          className={style.deleteButton}
          onClick={() => handleDelete(row.dishcat_id)}
        >
          Delete
        </button>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
      button: true,
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
  const filteredDishes = Array.isArray(dishes)
  ? dishes.filter((dish) =>
      dish.dishcat_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  return (
     <div className={`${style.nunito500} ${style.dish}`}>
      <div className={style.heading}>
        {/* <h2>Welcome to the Category Section</h2>
        <p>Here you can manage your Category.</p> */}

       
      </div>
      <div>
          {addDishIsOpen && (
                    <div
                      className={style.overlay}
                      onClick={toggleAddDish} // Clicking on the overlay closes the form
                    ></div>
                  )}
      {addDishIsOpen && (
        <div className={`${style.cardForm} ${addDishIsOpen ? style.animateOpen : ''}`}>
          <button 
                      className={style.closeButton} 
                      onClick={toggleAddDish} 
                      aria-label="Close"
                    >
                      &times;
                    </button>
          <h3>Add New Category</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={style.formGroupdish}>
              <label htmlFor="dishName">Category Name:</label>
              <input
                type="text"
                id="dishName"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                required
              />
            </div>
            <div className={style.buttonGroup}>
              <button type="button" onClick={handleAddDish}>
                Submit
              </button>
              {/* <button type="button" onClick={toggleAddDish}>
                Cancel
              </button> */}
            </div>
          </form>
        </div>
      )}
      </div>


      <div className={style.tableContainer}>
            <div className={style.searchbutton}>
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="Search by Category Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={style.addDish}>
          <button onClick={toggleAddDish}>Add New Category</button>
        </div>
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
