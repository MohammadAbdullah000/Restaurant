import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import style from "./Dish.module.css";
import axios from "axios";
const Dish = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishQuantity, setDishQuantity] = useState("");
  const [dishCategory, setDishCategory] = useState("");
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [noDishesMessage, setNoDishesMessage] = useState("");
    const [editDishIsOpen, setEditDishIsOpen] = useState(false);
    const [editDish,setEditDish] = useState([])
    const [singleDish,setsingledish] = useState('')
  
  // Fetch dishes
  // useEffect(() => {
    async function fetchDishes(dishCatID) {
      try {
        const response = await fetch(`https://letzbim.com/Restaurent/dishes_fetch_Api.php?dishCatID=${dishCatID}`);
        if (response.ok) {
          const data = await response.json();
          
          console.log("API Response:", data); // Log the full API response
          console.log("Length of data:", data.length); // Log the length
    if(!data.length){
      setNoDishesMessage("No Dishes Added"); // Show the message

    }
          if (Array.isArray(data) && data.length === 0) {
            setsingledish(data.dish_id)
            setDishes([]); // Clear dishes
          }  else {
            const formattedDishes = data.map((dish) => ({
              name: dish.dish_name,
              price: dish.dist_rate,
              quantity: dish.dish_qnty,
              category: dish.dishcat_name,
              id: dish.dish_id
            }));
            setDishes(formattedDishes);
            setNoDishesMessage(""); // Clear the message
          }
        } else {
          console.error("Failed to fetch dishes:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    }
    
    
  
    // }, []);
    
    
    // Fetch categories
    useEffect(() => {
      async function fetchCategories() {
        try {
          const response = await fetch(
            "https://letzbim.com/Restaurent/dish_categories_fetch_Api.php"
          );
          if (response.ok) {
            const data = await response.json();
            setCategories(data);
  
            // Set the first category as the default active category
            if (data.length > 0) {
              setActiveCategory(data[0].dishcat_id);
              fetchDishes(data[0].dishcat_id); // Fetch dishes for the default category
            }
          } else {
            console.error("Failed to fetch categories:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
  
      fetchCategories();
    }, []);
  
  

  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }
  function toggleEditDish() {
    setEditDishIsOpen(!editDishIsOpen);
  }
 
  const handleCategoryClick = (dishCatID) => {
    setActiveCategory(dishCatID);
    fetchDishes(dishCatID); // Fetch dishes for the selected category
  };
  const handleDelete = async (dishId) => {
    try {
      const response = await fetch('https://letzbim.com/Restaurent/dishes_delete_Api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ dish: dishId }),
      });
  console.log(dishId);
  
      const result = await response.json();
  
      if (result.successmessage === 'success') {
        // Use the 'id' field to filter out the deleted dish
        setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId));
        // fetchDishes(activeCategory)
      } else {
        alert(result.message || 'Failed to delete dish.');
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
      alert('An error occurred while deleting the dish.');
    }
  };

  const handleEdit = async (dish_id) => {
    try {
      // Construct the API URL with the given dishcat_id
      const apiUrl = `https://letzbim.com/Restaurent/Dishes_Edit_Fetch_Api.php?dish_id=${dish_id}`;
  
      // Make the GET request to fetch the category details
      const response = await axios.get(apiUrl);
  
      // Check if the response is successful
      if (response.data) {
        setEditDish(response.data)
  console.log('handleeit',response.data.dish_rate)
  console.log('handleeit',response.data)
  
        // Handle the fetched data (e.g., open a form with pre-filled data)
        console.log('Category Data:', response.data);
        setsingledish(response.data.dish_id)
        // Add your logic here to display or use the fetched data
        // For example, you can set the data in a state to pre-fill a form
      } else {
        // console.error('Failed to fetch category details:', response.data);
        alert('Failed to fetch category details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching category details:', data.errmessage);
      alert('An error occurred while fetching the category details.');
    }
  };
  
  
  const columns = [
    { name: "Dish Name", selector: (row) => row.name, sortable: true },
    { name: "Price", selector: (row) => `₹ ${row.price}`, sortable: true },
    { name: "Quantity", selector: (row) => row.quantity, sortable: true },
    {  name: '',
      cell: (row) => (
        <button
          className={style.deleteButton}
          onClick={() => {
        handleEdit(row. id);
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
    {  name: 'Actions',
      cell: (row) => (
        <button
          className={style.deleteButton}
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </button>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
      button: true,
    },
    // { name: "Category", selector: (row) => row.category, sortable: true },
  ];

  const customStyles = {
    headCells: {
      style: { fontSize: "18px", fontWeight: "bold" },
    },
    cells: {
      style: { fontSize: "16px" },
    },
  };

  const filteredDishes = dishes.filter((dish) =>
    dish.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleInputChange = (e) => {
    setEditDish(e.target.value); // Update the value as user types
  };









  async function handleAddDish() {
    const formData = new URLSearchParams();
    formData.append("dish_id", dishCategory);
    formData.append("dishname", dishName);
    formData.append("dish_qnty", dishQuantity);
    formData.append("dish_rate", dishPrice);
  
    try {
      const response = await fetch("https://letzbim.com/Restaurent/create_Sub_dishesApi.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.successmessage) {
          // Add the new dish to the state directly
          setDishes((prevDishes) => [
            ...prevDishes,
            {
              name: dishName,
              price: dishPrice,
              quantity: dishQuantity,
              category: categories.find((cat) => cat.dishcat_id === dishCategory)?.dishcat_name || "",
            },
          ]);
  
          // Clear form fields
          setDishName("");
          setDishPrice("");
          setDishQuantity("");
          setDishCategory("");
  
          // Close the form
          toggleAddDish();
  
          // Fetch dishes again to update the table
          fetchDishes(activeCategory); // Ensure we fetch dishes for the active category
        } else {
          alert("Failed to add dish: " + result.errmessage);
        }
      } else {
        alert("API Error: " + response.statusText);
      }
    } catch (error) {
      console.error("Error adding dish:", result.errmessage);
      alert("Failed to add dish. Please try again later.");
    }
  }
  async function handleUpdateDish() {
    const formData = new URLSearchParams();
  console.log('a',editDish.dish_name);
  
    formData.append("subdish_id", singleDish); // Replace with the actual ID
    formData.append("dish_id", dishCategory || editDish.dish_cat_id); // Use either the selected category or the existing one
    formData.append("dishname", dishName || editDish.dish_name); // Use updated or existing dish name
    formData.append("dish_rate", dishPrice || editDish.dist_rate); // Use updated or existing price
    formData.append("dish_qnty", dishQuantity || editDish.dish_qnty); // Use updated or existing quantity
  
    try {
      const response = await fetch("https://letzbim.com/Restaurent/subDish_update_Api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.successmessage) {
console.log(editDish.dish_rate);

          // Update the dish in the state directly
          setDishes((prevDishes) =>
            prevDishes.map((dish) =>
              dish.subdish_id === singleDish
                ? {
                    ...dish,
                    name: dishName || editDish.dish_name,
                    price: dishPrice || editDish.dist_rate,
                    quantity: dishQuantity || editDish.dish_qnty,
                    category:
                      categories.find((cat) => cat.dishcat_id === (dishCategory || editDish.dish_cat_id))
                        ?.dishcat_name || "",
                  }
                : dish
            )
          );
  
          // Clear form fields
          setDishName("");
          setDishPrice("");
          setDishQuantity("");
          setDishCategory("");
  
          // Close the form
          toggleEditDish();
  
          // Fetch dishes again to update the table
          fetchDishes(activeCategory); // Ensure we fetch dishes for the active category
        } else {
          alert("Failed to update dish: " + result.errmessage);
        }
      } else {
        alert("API Error: " + response.statusText);
      }
    } catch (error) {
      console.error("Error updating dish:", error);
      alert("Failed to update dish. Please try again later.");
    }
  }
  
  

  return (
    <div className={`${style.nunito500} ${style.dish}`}>
      <div className={style.heading}>
        {/* <h3>Dish Section</h3> */}
        {/* <p>Here you can manage your Dishes.</p> */}
        
      </div>
           

      <div>
  {/* Overlay */}
  {addDishIsOpen && (
    <div
      className={style.overlay}
      onClick={toggleAddDish} // Clicking on the overlay closes the form
    ></div>
  )}

  {/* Card Form */}
  {addDishIsOpen && (
    <div className={`${style.cardForm} ${addDishIsOpen ? style.animateOpen : ""}`}>
    <button 
      className={style.closeButton} 
      onClick={toggleAddDish} 
      aria-label="Close"
    >
      &times;
    </button>
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
            type="text"
            id="dishQuantity"
            value={dishQuantity}
            onChange={(e) => setDishQuantity(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="dishCategory">Dish Category:</label>
          <select
            id="dishCategory"
            value={dishCategory}
            onChange={(e) => setDishCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.dishcat_id} value={category.dishcat_id}>
                {category.dishcat_name}
              </option>
            ))}
          </select>
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

  {editDishIsOpen && (
    <div
      className={style.overlay}
      onClick={toggleEditDish} // Clicking on the overlay closes the form
    ></div>
  )}

  {/* Card Form */}
  {editDishIsOpen && (
    <div className={`${style.cardForm} ${editDishIsOpen ? style.animateOpen : ""}`}>
    <button 
      className={style.closeButton} 
      onClick={toggleEditDish} 
      aria-label="Close"
    >
      &times;
    </button>
      <h3>Add New Dish</h3>

      <form onSubmit={(e) => e.preventDefault()}>
  <div className={style.formGroupdish}>
    <label htmlFor="dishName">Dish Name:</label>
    <input
      type="text"
      id="dishName"
      value={editDish.dish_name || ""} // Bind to editDish state
      onChange={(e) =>
        setEditDish((prevDish) => ({
          ...prevDish,
          dish_name: e.target.value,
        }))
      }
      required
    />
  </div>
  <div className={style.formGroupdish}>
  <label htmlFor="dishPrice">Price:</label>
  <input
    type="number"
    id="dishPrice"
    value={editDish.dist_rate || ""} // Correct property name
    onChange={(e) =>
      setEditDish((prevDish) => ({
        ...prevDish,
        dist_rate: e.target.value, // Use the same property name here
      }))
    }
    required
  />
</div>

  <div className={style.formGroupdish}>
    <label htmlFor="dishQuantity">Quantity:</label>
    <input
      type="text"
      id="dishQuantity"
      value={editDish.dish_qnty || ""} // Bind to editDish state
      onChange={(e) =>
        setEditDish((prevDish) => ({
          ...prevDish,
          dish_qnty: e.target.value,
        }))
      }
      required
    />
  </div>
  <div className={style.formGroupdish}>
    <label htmlFor="dishCategory">Dish Category:</label>
    <select
      id="dishCategory"
      value={editDish.dish_id || ""} // Bind to editDish state
      onChange={(e) =>
        setEditDish((prevDish) => ({
          ...prevDish,
          dish_id: e.target.value,
        }))
      }
      required
    >
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.dishcat_id} value={category.dishcat_id}>
          {category.dishcat_name}
        </option>
      ))}
    </select>
  </div>
  <div className={style.buttonGroup}>
    <button type="button" onClick={handleUpdateDish}>
      Submit
    </button>
  </div>
</form>

    </div>
  )}

</div>


      {/* <div className={style.tableContainer}>
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="Search by Dish Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}


      <div className={style.tableContainer}>
      <div className={style.searchbutton}>

        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="Search by Dish Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={style.addDish}>
          <button onClick={toggleAddDish} style={{display: !categories.length ?'none' :'block'}}>Add New Dish</button>
        </div>
      </div>

        <div className={style.tableWrapper}>
         <div className={style.categoryTabs}>
 {!categories.length?(
  <p style={{fontSize:'30px', color:'red',margin:'auto'}}>Please add Category first</p>
 ):(
  categories.map((category) => (
    <button
      key={category.dishcat_id}
      className={`${style.tabButton} ${
        activeCategory === category.dishcat_id ? style.activeTab : ""
      }`}
      onClick={() => handleCategoryClick(category.dishcat_id)}
    >
      {category.dishcat_name}
    </button>
  ))
 )}
</div>
<div>
  {noDishesMessage ? (
    <p className={style.noDishesMessage}>{noDishesMessage}</p>
  ) : (
    <DataTable
      className={style.datatable}
      columns={columns}
      data={filteredDishes}
      pagination
      highlightOnHover
      customStyles={customStyles}
    />
  )}
</div>

        </div>
      </div>
    {/* </div> */}
      </div>
    // </div>
  );
};

export default Dish;
