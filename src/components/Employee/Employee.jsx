import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import style from "./Employee.module.css";
import Designation from "../Designation/Designation";
import axios from "axios";

const Dish = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeeMobile, setEmployeeMobile] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [employees, setEmployees] = useState([]);
  const [desginationID, setdesginationID] = useState([]);
  const [Designations, setDesignations] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [noEmployeesMessage, setNoEmployeesMessage] = useState("");
  // Fetch Employees
  // useEffect(() => {
    async function fetchEmployee(desigId) {
      try {
        const response = await fetch(`https://letzbim.com/Restaurent/employee_fetch_Api.php?desigId=${desigId}`);
        if (response.ok) {
          const data = await response.json();
          
          console.log("API Response:", data); // Log the full API response
          console.log("Length of data:", data.length); // Log the length
    if(!data.length){
      setNoEmployeesMessage("No Employee Added"); // Show the message

    }
          {
            const formattedEmployees = data.map((dish) => ({
              EmployeesIDS: dish.emp_card_id,
              FullName: dish.emp_name,
              Email: dish.emp_email,
              Mobile: dish.emp_mobile,
              Address: dish.emp_address,
              Salary: dish.emp_salary,
              ids:dish.emp_id
            }));
            setEmployees(formattedEmployees);
            console.log('h',formattedEmployees);
            
            setNoEmployeesMessage(""); // Clear the message
          }
        } else {
          console.error("Failed to fetch employees:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    
    
  
    // }, []);
    
    
    // Fetch Designations
    useEffect(() => {
      async function fetchDesignations() {
        try {
          const response = await fetch(
            "https://letzbim.com/Restaurent/designation_fetch_Api.php"
          );
          if (response.ok) {
            const data = await response.json();
            console.log('aaa',data);
            setDesignations(data);
            
            console.log('ca',Designations);
            
  
            // Set the first category as the default active category
            if (data.length > 0) {
              setActiveCategory(data[0].id);
              fetchEmployee(data[0].id); // Fetch Employees for the default category
            }
          } else {
            console.error("Failed to fetch Designations:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching Designations:", error);
        }
      }
  
      fetchDesignations();
    }, []);
  
  

  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }

  useEffect(() => {
    // Fetch unique number from the API when the component mounts
    const fetchUniqueID = async () => {
      try {
        const response = await axios.get("https://letzbim.com/Restaurent/UniqueNUmberFetchApi.php");
        if (response.data && response.data.employee_ID) {
          setEmployeeID(response.data.employee_ID); // Assuming the response contains the unique ID in this structure
        } else {
          console.error("Invalid response structure", response.data);
        }
      } catch (error) {
        console.error("Error fetching unique ID:", error);
      }
    };

    fetchUniqueID();
  }, [employees]);

  async function handleAddDish() {
    const formData = new URLSearchParams();
    formData.append("EmployeesIDS", employeeID);
    formData.append("FullName", employeeName);
    formData.append("Email", employeeEmail);
    formData.append("Mobile", employeeMobile);
    formData.append("Address", employeeAddress);
    formData.append("Salary", employeeSalary);
    formData.append("DesigId", desginationID);
  
    try {
      const response = await fetch("https://letzbim.com/Restaurent/employee_create_Api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if (result.successmessage) {
          // Add the new dish to the state directly
          setEmployees((prevEmployees) => [
            ...prevEmployees,
            {
              EmployeesIDS: employeeID,
              FullName: employeeName,
              Email: employeeEmail,
              Mobile: employeeMobile,
              Address: employeeAddress,
              Salary: employeeSalary,
              // Designation: desginationID
              DesigId: Designations.find((cat) => cat.DesigId === desginationID)?.designation_name || "",
            },
          ]);
  
          // Clear form fields
          setEmployeeID("")
          setEmployeeName("");
          setEmployeeEmail("");
          setEmployeeMobile("");
          setEmployeeEmail("");
          setEmployeeSalary("");
          setdesginationID("")
  
          // Close the form
          toggleAddDish();
  
          // Fetch Employees again to update the table
          fetchEmployee(activeCategory); // Ensure we fetch Employees for the active category
          console.log('success')
        } else {
          alert("Failed to add dish: " + result.errmessage);
          console
        }
      } else {
        alert("API Error: " + response.statusText);
      }
    } catch (error) {
      console.error("Error adding dish:", result.errmessage);
      alert("Failed to add dish. Please try again later.");
    }
  }
  
  const handleCategoryClick = (dishCatID) => {
    setActiveCategory(dishCatID);
    fetchEmployee(dishCatID); // Fetch Employees for the selected category
  };

  const handleDelete = async (empID) => {
    try {
      const response = await fetch("https://letzbim.com/Restaurent/employee_detelte_Api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ empID: empID }),
      });
  
      const result = await response.json();
      // console.log('ffffffff',desigId)
  
      if (result.successmessage === "success") {
        setEmployees((prevEmployees) => prevEmployees.filter((dish) => dish.EmployeesIDS !== empID));
        console.log('aa',activeCategory);
        
        fetchEmployee(activeCategory);
      } else {
        alert(result.message || "Failed to delete employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee.");
    }
  };
  
  const columns = [
    { name: "EmployeeID", selector: (row) => row.EmployeesIDS, sortable: true },
    { name: "Full Name", selector: (row) => row.FullName, sortable: true },
    { name: "Email", selector: (row) => row.Email, sortable: true },
    { name: "Mobile", selector: (row) => row.Mobile, sortable: true },
    { name: "Address", selector: (row) => row.Address, sortable: true },
    { name: "Salary", selector: (row) => row.Salary, sortable: true },
     {  name: 'Actions',
          cell: (row) => (
            <button
              className={style.deleteButton}
              onClick={() => handleDelete(row.ids)}
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

  const filteredEmployees = employees.filter((dish) =>
    dish.FullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${style.nunito500} ${style.dish}`}>
      <div className={style.heading}>
        {/* <h2>Welcome to the Employee Section</h2> */}
        {/* <p>Here you can manage your Employee.</p> */}
       
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
      <h3>Add New Employee</h3>
      <form onSubmit={(e) => e.preventDefault()}>
      <div className={style.formGroupdish}>
          <label htmlFor="id">ID:</label>
          <input
            type="number"
            id="id"
            value={employeeID}
            readOnly 
            // onChange={(e) => setEmployeeID(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="mobile">Mobile:</label>
          <input
            type="number"
            id="mobile"
            value={employeeMobile}
            onChange={(e) => setEmployeeMobile(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={employeeAddress}
            onChange={(e) => setEmployeeAddress(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="salary">Salary:</label>
          <input
            type="text"
            id="salary"
            value={employeeSalary}
            onChange={(e) => setEmployeeSalary(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
                  <label htmlFor="designation">Designation:</label>
                  <select
                    id="designation"
                    value={desginationID}
                    onChange={(e) => setdesginationID(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                   
                   
                   
                    {Designations.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.designation_name}
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
          <button onClick={toggleAddDish}  style={{ display: !Designations.length ? 'none' : 'block' }}>Add New Employee</button>
        </div>
        </div>

        <div className={style.tableWrapper}>
        <div className={style.categoryTabs}>
  {!Designations.length?(
    <p style={{fontSize:'30px', color:'red',margin:'auto'}}>Please add Designation first</p>
  ):(

    Designations.map((category) => (
    <button
      key={category.id}
      className={`${style.tabButton} ${
        activeCategory === category.id ? style.activeTab : ""
      }`}
      onClick={() => handleCategoryClick(category.id)}
    >
      {category.designation_name}
    </button>
  )))}
</div>
<div>
  {noEmployeesMessage ? (
    <p className={style.noEmployeesMessage}>{noEmployeesMessage}</p>
  ) : (
    <DataTable
      className={style.datatable}
      columns={columns}
      data={filteredEmployees}
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