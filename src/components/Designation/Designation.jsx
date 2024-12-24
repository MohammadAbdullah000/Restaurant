import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import style from './Designation.module.css';
import axios from 'axios';
const Designation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [designationName, setdesignationName] = useState('');
    const [editDesignation,setEditDesignation] = useState([])
    const [editDishIsOpen, setEditDishIsOpen] = useState(false);

  const [dishes, setDishes] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchDesignation() {
      try {
        const response = await fetch('https://letzbim.com/Restaurent/designation_fetch_Api.php');
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data); // Log the API response to see its structure
  
          // Ensure data is an array
          if (Array.isArray(data)) {
            setDishes(data);
            console.log('s',dishes);
            
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
  
    fetchDesignation();
  }, []);
  

  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }
  function toggleEditDish() {
    setEditDishIsOpen(!editDishIsOpen);
  }

  async function handleAddDish() {
    try {
      const response = await fetch('https://letzbim.com/Restaurent/designation_create_Api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          designation_name: designationName,
        }),
      });

      const result = await response.json();

      if (result.successmessage === 'success') {
        setDishes((prevDishes) => [
          ...prevDishes,
          { designation_name: designationName, dishcat_id: result.new_id },
        ]);
        console.log('successsss')
        setdesignationName('');
        toggleAddDish();
      }
      else {
        alert(result.errmessage || 'Failed to add Designation.');
      }
    } catch (error) {
      console.error('Error adding Designation:', result.errmessage);
      alert('An error occurred while adding the Designation.');
    }
  }

  // Handle delete category
  const handleDelete = async (dishId) => {
    try {
      const response = await fetch('https://letzbim.com/Restaurent/Designation_Delete_Api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          desigID: dishId,
        }),
      });

      const result = await response.json();

      if (result.successmessage === 'success') {
        // Remove deleted dish from local state
        setDishes(dishes.filter((dish) => dish.id !== dishId));
      } else {
        alert(result.message || 'Failed to delete Designation.');
      }
    } catch (error) {
      console.error('Error deleting Designation:', error);
      alert('An error occurred while deleting the Designation.');
    }
  };

  
const handleEdit = async (desigId) => {
  try {
    // Construct the API URL with the given dishcat_id
    const apiUrl = `https://letzbim.com/Restaurent/Designation_Edit_Fetch_Api.php?desigId=${desigId}`;

    // Make the GET request to fetch the category details
    const response = await axios.get(apiUrl);

    // Check if the response is successful
    if (response.data) {
      setEditDesignation(response.data)

      // Handle the fetched data (e.g., open a form with pre-filled data)
      console.log('Category Data:', editDesignation);
      // Add your logic here to display or use the fetched data
      // For example, you can set the data in a state to pre-fill a form
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
      name: 'Desingation Name',
      selector: (row) => row.designation_name,
      sortable: true,
    },
    {
      name: '',
      cell: (row) => (
        <button
          className={style.deleteButton}
          onClick={() => {
        handleEdit(row.id);
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
          onClick={() => handleDelete(row.id)}
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
  const handleInputChange = (e) => {
    setEditDesignation(e.target.value); // Update the value as user types
  };
  // Filtered dishes based on the search term
  const filteredDishes = Array.isArray(dishes)
  ? dishes.filter((dish) =>
      dish.designation_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  return (
    <div className={`${style.nunito500} ${style.dish}`}>
      <div className={style.heading}>
        {/* <h2>Welcome to the Designation Section</h2>
        <p>Here you can manage your Designation.</p> */}

      
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
          <h3>Add New Designation</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={style.formGroupdish}>
              <label htmlFor="designation">Designation Name:</label>
              <input
                type="text"
                id="designation"
                value={designationName}
                onChange={(e) => setdesignationName(e.target.value)}
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
      <div>
         {editDishIsOpen && (
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
          <h3>Add New Designation</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={style.formGroupdish}>
              <label htmlFor="designation">Designation Name:</label>
              <input
                type="text"
                id="designation"
                value={editDesignation.designation_name}
                onChange={handleInputChange}
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
            placeholder="Search by Designation Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={style.addDish}>
          <button onClick={toggleAddDish}>Add New Designation</button>
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

export default Designation;
