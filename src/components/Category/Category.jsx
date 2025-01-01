import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import style from './Category.module.css';
import axios from 'axios';
const Category = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [editDishIsOpen, setEditDishIsOpen] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishCatId, setdishcatid] = useState('');
  const [dishes, setDishes] = useState([]);
  const [editCategory,setEditCategory] = useState([])

  // Fetch categories on component mount
  // useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('https://hotelbarkat.com/Apis/dish_categories_fetch_Api.php');
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data); // Log the API response to see its structure
  setdishcatid(data.dishcat_id)
          // Ensure data is an array
          if (Array.isArray(data)) {
            setDishes(data);
            console.log(dishes);
            
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
  useEffect(()=>{
    fetchCategories();

  },[])
  // }, []);
  

  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }

  function toggleEditDish() {
    setEditDishIsOpen(!editDishIsOpen);
  }

  async function handleAddDish() {
    try {
      const response = await fetch('https://hotelbarkat.com/Apis/dishes_create_Api.php', {
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
        fetchCategories()
      }
      else {
        alert(result.message || 'Failed to add category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category.');
    }
  }
  async function handleUpdateCategory() {
    try {
      // Validate inputs
      if (!editCategory.dishcat_id || !editCategory.dishcat_name) {
        alert("Please provide both category ID and name.");
        return;
      }
  
      const response = await fetch("https://hotelbarkat.com/Apis/dishes_update_Api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          dishcatId: editCategory.dishcat_id,
          dishname: editCategory.dishcat_name,
        }),
      });
  
      const result = await response.json();
  
      if (result.successmessage === "success") {
        setDishes((prevDishes) =>
          prevDishes.map((dish) =>
            dish.dishcat_id === editCategory.dishcat_id
              ? { ...dish, dishcat_name: editCategory.dishcat_name }
              : dish
          )
        );
        fetchCategories()
        toggleEditDish(); // Close the form
        alert("Category updated successfully!");
      } else {
        alert(result.message || "Failed to update category.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred while updating the category.");
    }
  }
  

  // Handle delete category
  const handleDelete = async (dishId) => {
    try {
      const response = await fetch('https://hotelbarkat.com/Apis/dish_category_delete_Api.php', {
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
        fetchCategories()
      } else {
        alert(result.message || 'Failed to delete category.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred while deleting the category.');
    }
  };

  
const handleEdit = async (dishcat_id) => {
  try {
    // Construct the API URL with the given dishcat_id
    const apiUrl = `https://hotelbarkat.com/Apis/Dish_categories_Edit_fetch_Api.php?dishcat_id=${dishcat_id}`;

    // Make the GET request to fetch the category details
    const response = await axios.get(apiUrl);

    // Check if the response is successful
    if (response.data) {
      setEditCategory(response.data)

      // Handle the fetched data (e.g., open a form with pre-filled data)
      // console.log('Category Data:', categoryData);
      // Add your logic here to display or use the fetched data
      // For example, you can set the data in a state to pre-fill a form
      fetchCategories()
    } else {
      // console.error('Failed to fetch category details:', response.data);
      alert('Failed to fetch category details. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching category details:', error);
    alert('An error occurred while fetching the category details.');
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
      name: '',
      cell: (row) => (
        <button
          className={style.deleteButton}
          onClick={() => {
        handleEdit(row.dishcat_id);
        toggleEditDish();
      }}
        >
          Edit
        </button>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
      button: true,
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
  const handleInputChange = (e) => {
    setEditCategory(e.target.value); // Update the value as user types
  };

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
      <div> {editDishIsOpen && (
                    <div
                      className={style.overlay}
                      onClick={toggleEditDish} // Clicking on the overlay closes the form
                    ></div>
                  )}
                  {editDishIsOpen && (
  <div className={`${style.cardForm} ${editDishIsOpen ? style.animateOpen : ''}`}>
    <button 
      className={style.closeButton} 
      onClick={toggleEditDish} 
      aria-label="Close"
    >
      &times;
    </button>
    <h3>Edit Category</h3>
    <form onSubmit={(e) => e.preventDefault()}>
      <div className={style.formGroupdish}>
        <label htmlFor="dishName">Category Name:</label>
        <input
          type="text"
          id="dishName"
          value={editCategory.dishcat_name || ''}
          onChange={(e) =>
            setEditCategory((prev) => ({
              ...prev,
              dishcat_name: e.target.value,
            }))
          }
          required
        />
      </div>
      <div className={style.buttonGroup}>
        <button type="button" onClick={handleUpdateCategory}>
          Submit
        </button>
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
