import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import style from './Inventory.module.css';
import axios from 'axios';
const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [invenTitle, setInvenTitle] = useState('');
  const [invenDate, setInvenDate] = useState('');
  const [invenDesc, setInvenDesc] = useState('');
  const [invenQnty, setInvenQnty] = useState('');
  const [invenAmt, setInvenAmt] = useState('');
  const [editDesignation, setEditDesignation] = useState([])
  const [editDishIsOpen, setEditDishIsOpen] = useState(false);
  const [inventory, setInventory] = useState([]);

  // Fetch categories on component mount
  // useEffect(() => {
  async function fetchDesignation() {
    try {
      const response = await fetch('https://hotelbarkat.com/Apis/Inventory_Fetch_Api.php');
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Log the API response to see its structure

        // Ensure data is an array
        if (Array.isArray(data)) {
        setInventory(data);

        }
         else {
          console.error('API did not return an array. Received:', data);
          setInventory([]); // Fallback to an empty array
        }
      } else {
        console.error('Failed to fetch categories:', response.statusText);
        setInventory([]); // Fallback to an empty array on failure
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setInventory([]); // Set to empty array on error
    }
  }
  useEffect(() => {
    fetchDesignation();
  }, [])

  // fetchDesignation();
  // }, []);


  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }
  function toggleEditDish() {
    setEditDishIsOpen(!editDishIsOpen);
  }

  async function handleAddInventory() {
    try {
      const response = await fetch('https://hotelbarkat.com/Apis/Inventory_Add_Api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          date: invenDate,
          titles: invenTitle,
          description: invenDesc,
          qnty: invenQnty,
          amount: invenAmt,
        }),
      });

      const result = await response.json();

      if (result.successmessage === 'success') {
        setInventory((prevDishes) => [
          ...prevDishes,
          {
            date: invenDate, titles: invenTitle,
            description: invenDesc,
            qnty: invenQnty,
            amount: invenAmt,
          },
        ]);
        console.log('successsss')
        setInvenAmt('');
        setInvenDate('');
        setInvenDesc('');
        setInvenTitle('');
        setInvenQnty('');
        fetchDesignation()
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

  // async function handleUpdateDesignation() {
  //   try {
  //     const response = await fetch('https://hotelbarkat.com/Apis/Designation_Update_APi.php', {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: new URLSearchParams({
  //         desig_id: editDesignation.id,
  //         designation_name: editDesignation.designation_name,
  //       }),
  //     })

  //     const result = await response.json()
  //     if (result.successmessage === 'success') {
  //       setInventory((prevDesignations) =>
  //         prevDesignations.map((designation) =>
  //           designation.desig_id === editDesignation.id
  //             ? { ...designation, designation_name: editDesignation.designation_name }
  //             : designation
  //         )
  //       );
  //       // setdesignationName('');
  //       toggleEditDish();
  //       fetchDesignation()
  //     } else {
  //       alert(result.message || 'Failed to add category.');
  //     }
  //   } catch (error) {
  //     console.error('Error adding category:', error);
  //     alert('An error occurred while adding the category.');
  //   }


  // }
  // Handle delete category
  const handleDelete = async (dishId) => {
    try {
      const response = await fetch('https://hotelbarkat.com/Apis/Inventory_Delete_Api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          inv_id: dishId,
        }),
      });

      const result = await response.json();

      if (result.successmessage === 'success') {
        // Remove deleted dish from local state
        setInventory(inventory.filter((dish) => dish.id !== dishId));
        fetchDesignation()
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
      const apiUrl = `https://hotelbarkat.com/Apis/Designation_Edit_Fetch_Api.php?desigId=${desigId}`;

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
      name: 'Date',
      selector: (row) => row.inv_date,
      sortable: true,
    },
    {
      name: 'Inventory Name',
      selector: (row) => row.inv_title,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row) => row.inv_Desc,
      sortable: true,
    },
    {
      name: 'Quantity',
      selector: (row) => row.inv_qnty,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row) => row.inv_amount,
      sortable: true,
    },

    {
      name: 'Actions',
      cell: (row) => (
        <button
          className={style.deleteButton}
          onClick={() => handleDelete(row.inv_id)}
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
  // Filtered inventory based on the search term
  // const filteredDishes = Array.isArray(inventory)
  //   ? inventory.filter((dish) =>
  //     dish.designation_name?.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   : [];


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
            <h3>Add Inventory</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={style.formGroupdish}>
                <label htmlFor="date">Inventory Date:</label>
                <input
                  type="date"
                  id="date"
                  value={invenDate}
                  onChange={(e) => setInvenDate(e.target.value)}
                  required
                />
              </div>
              <div className={style.formGroupdish}>
                <label htmlFor="inventory">Inventory Name:</label>
                <input
                  type="text"
                  id="inventory"
                  value={invenTitle}
                  onChange={(e) => setInvenTitle(e.target.value)}
                  required
                />
              </div>
              <div className={style.formGroupdish}>
                <label htmlFor="des">Inventory Description:</label>
                <input
                  type="text"
                  id="des"
                  value={invenDesc}
                  onChange={(e) => setInvenDesc(e.target.value)}
                  required
                />
              </div>
              <div className={style.formGroupdish}>
                <label htmlFor="qua">Quantity:</label>
                <input
                  type="text"
                  id="qua"
                  value={invenQnty}
                  onChange={(e) => setInvenQnty(e.target.value)}
                  required
                />
              </div>
              <div className={style.formGroupdish}>
                <label htmlFor="amt">Amount:</label>
                <input
                  type="text"
                  id="amt"
                  value={invenAmt}
                  onChange={(e) => setInvenAmt(e.target.value)}
                  required
                />
              </div>
              <div className={style.buttonGroup}>
                <button type="button" onClick={handleAddInventory}>
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
      {/* <div>
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
            <h3>Edit Designation</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={style.formGroupdish}>
                <label htmlFor="designation">Designation Name:</label>
                <input
                  type="text"
                  id="designation"
                  value={editDesignation.designation_name || ''}
                  onChange={(e) =>
                    setEditDesignation((prev) => ({
                      ...prev,
                      designation_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={style.buttonGroup}>
                <button type="button" onClick=
                  {() => {
                    fetchDesignation()
                    handleUpdateDesignation()
                  }}>
                  Submit
                </button>
          
              </div>
            </form>
          </div>
        )}
      </div> */}


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
            <button onClick={toggleAddDish}>Add Inventory</button>
          </div>
        </div>
        <DataTable
          className={style.datatable}
          columns={columns}
          data={inventory}
          pagination
          highlightOnHover
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default Inventory;
