import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import style from "./Employee.module.css";
import Designation from "../Designation/Designation";
import axios from "axios";

const Employee = () => {
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
  const [editDishIsOpen, setEditDishIsOpen] = useState(false);
  const [editEmp, setEditEmp] = useState([])
  // Fetch Employees
  // useEffect(() => {
  async function fetchEmployee(desigId) {
    try {
      const response = await fetch(`https://hotelbarkat.com/Apis/employee_fetch_Api.php?desigId=${desigId}`);
      if (response.ok) {
        const data = await response.json();

        console.log("API Response:", data); // Log the full API response
        console.log("Length of data:", data.length); // Log the length
        if (!data.length) {
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
            ids: dish.emp_id
          }));
          setEmployees(formattedEmployees);
          console.log('h', formattedEmployees);

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
          "https://hotelbarkat.com/Apis/designation_fetch_Api.php"
        );
        if (response.ok) {
          const data = await response.json();
          console.log('aaa', data);
          setDesignations(data);

          console.log('ca', Designations);


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
  function toggleEditDish() {
    setEditDishIsOpen(!editDishIsOpen);
  }
  useEffect(() => {
    // Fetch unique number from the API when the component mounts
    const fetchUniqueID = async () => {
      try {
        const response = await axios.get("https://hotelbarkat.com/Apis/UniqueNUmberFetchApi.php");
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


  const handleEdit = async (emp_id) => {
    try {
      // Construct the API URL with the given dishcat_id
      const apiUrl = `https://hotelbarkat.com/Apis/employee_Profile_Edit_Fetch_Api.php?emp_id=${emp_id}`;

      // Make the GET request to fetch the category details
      const response = await axios.get(apiUrl);

      // Check if the response is successful
      if (response.data) {
        setEditEmp(response.data)
        console.log(editEmp);

        // Handle the fetched data (e.g., open a form with pre-filled data)
        console.log('Category Data:', response.data);
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
      const response = await fetch("https://hotelbarkat.com/Apis/employee_create_Api.php", {
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
              DesignId: Designations.find((cat) => cat.DesigID === desginationID)?.designation_name || "",
            },
          ]);

          // Clear form fields
          setEmployeeID("")
          setEmployeeName("");
          setEmployeeAddress("");
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
      const response = await fetch("https://hotelbarkat.com/Apis/employee_detelte_Api.php", {
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
        console.log('aa', activeCategory);

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
    // { name: "Salary", selector: (row) => row.Salary, sortable: true },
    {
      name: '',
      cell: (row) => (
        <button
          className={style.deleteButton}
          onClick={() => {
            handleEdit(row.ids);
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

  useEffect(() => {
    if (editEmp) {
      setEmployeeName(editEmp.emp_name || '');
      setEmployeeEmail(editEmp.emp_email || '');
      setEmployeeMobile(editEmp.emp_mobile || '');
      setEmployeeSalary(editEmp.emp_salary || '');
      setEmployeeAddress(editEmp.emp_address || '');
      setdesginationID(editEmp.desigID || '');
      console.log(editEmp);

    }
  }, [editEmp]);
  const handleInputChange = (e) => {
    setEditDish(e.target.value); // Update the value as user types
  };
  const handleUpdateEmployee = async () => {
    // Ensure designation ID is selected
    if (!desginationID && !editEmp?.desigID) {
      alert("Please select a designation.");
      return;
    }

    // Prepare form data for the API request
    // const formData = new URLSearchParams();

    // Using the state values or the existing editEmp fields as fallback
    // formData.append("empId", employeeID || editEmp.emp_id);
    // formData.append("FullName", employeeName || editEmp.emp_name);
    // formData.append("Email", employeeEmail || editEmp.emp_email);
    // formData.append("Mobile", employeeMobile || editEmp.emp_mobile);
    // formData.append("Address", employeeAddress || editEmp.emp_address);
    // formData.append("Salary", employeeSalary || editEmp.emp_salary);
    // formData.append("DesigId", desginationID || editEmp.desigID);

    try {
      const response = await fetch("https://hotelbarkat.com/Apis/Employee_update_Api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          empId: editEmp.emp_id,
          FullName: editEmp.emp_name,
          Email: editEmp.emp_email,
          Mobile: editEmp.emp_mobile,
          Salary: editEmp.emp_salary,
          Address: editEmp.emp_address,
          DesigId: editEmp.desigID,
        }),
      });

      const result = await response.json();
      // if (response.ok) {
      if (result.successmessage) {
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.emp_id === (editEmp.emp_id)
              ? {
                ...emp,
                emp_id: employeeID || editEmp.emp_id,
                emp_name: employeeName || editEmp.emp_name,
                emp_email: employeeEmail || editEmp.emp_email,
                emp_mobile: employeeMobile || editEmp.emp_mobile,
                emp_address: employeeAddress || editEmp.emp_address,
                emp_salary: employeeSalary || editEmp.emp_salary,
                desigID: Designations.find(
                  (desig) => desig.id === (desginationID || editEmp.desigID)
                )?.designation_name || "",
              }
              : emp
          )
        );

        // Reset form and states after successful update
        setEmployeeID("");
        setEmployeeName("");
        setEmployeeEmail("");
        setEmployeeMobile("");
        setEmployeeAddress("");
        setEmployeeSalary("");
        setdesginationID("");

        toggleEditDish(); // Close the edit form
        fetchEmployee(activeCategory); // Refresh employee list
      } else {
        alert("Failed to update employee: " + result.errmessage);
      }
      // }
      //  else {
      //   alert("API Error: " + response.statusText);
      // }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee. Please try again later.");
    }
  };




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
                  // onChange={(e) => handleInputChange("emp_name", e.target.value)}
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
                  // onChange={(e) => handleInputChange("emp_email", e.target.value)}
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
                  // onChange={(e) => handleInputChange("emp_mobile", e.target.value)}
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
                  // onChange={(e) => handleInputChange("emp_address", e.target.value)}
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
                  // onChange={(e) => handleInputChange("emp_salary", e.target.value)}
                  onChange={(e) => setEmployeeSalary(e.target.value)}
                  required
                />
              </div>
              <div className={style.formGroupdish}>
                <label htmlFor="designation">Designation:</label>
                <select
                  id="designation"
                  value={desginationID}
                  // onChange={(e) => handleInputChange("desigID", e.target.value)}
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
        {editDishIsOpen && (
          <div
            className={style.overlay}
            onClick={toggleEditDish} // Clicking on the overlay closes the form
          ></div>
        )}

        {/* Card Form */}
        {editDishIsOpen && (
          <div className={`${style.cardForm} ${editDishIsOpen ? style.animateOpen : ""}`}>
            <button className={style.closeButton} onClick={toggleEditDish} aria-label="Close">
              &times;
            </button>
            <h3>Edit Employee</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={style.formGroupdish}>
                <label htmlFor="id">ID:</label>
                <input
                  type="number"
                  id="id"
                  value={editEmp.emp_card_id || ""}
                  readOnly
                  required
                />
              </div>

              <div className={style.formGroupdish}>
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  value={editEmp.emp_name || ""}
                  onChange={(e) => setEditEmp((prev) => ({ ...prev, emp_name: e.target.value }))}
                  required
                />
              </div>

              <div className={style.formGroupdish}>
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  id="email"
                  value={editEmp.emp_email || ""}
                  onChange={(e) => setEditEmp((prev) => ({ ...prev, emp_email: e.target.value }))}
                  required
                />
              </div>

              <div className={style.formGroupdish}>
                <label htmlFor="mobile">Mobile:</label>
                <input
                  type="number"
                  id="mobile"
                  value={editEmp.emp_mobile || ""}
                  onChange={(e) => setEditEmp((prev) => ({ ...prev, emp_mobile: e.target.value }))}
                  required
                />
              </div>

              <div className={style.formGroupdish}>
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  value={editEmp.emp_address || ""}
                  onChange={(e) => setEditEmp((prev) => ({ ...prev, emp_address: e.target.value }))}
                  required
                />
              </div>

              <div className={style.formGroupdish}>
                <label htmlFor="salary">Salary:</label>
                <input
                  type="text"
                  id="salary"
                  value={editEmp.emp_salary || ""}
                  onChange={(e) => setEditEmp((prev) => ({ ...prev, emp_salary: e.target.value }))}
                  required
                />
              </div>

              <div className={style.formGroupdish}>
                <label htmlFor="designation">Designation:</label>
                <select
                  id="designation"
                  value={editEmp.desigID || ""}
                  onChange={(e) => setEditEmp((prev) => ({ ...prev, desigID: e.target.value }))}
                  required
                >
                  <option value="">Select a designation</option>
                  {Designations.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.designation_name}
                    </option>
                  ))}
                </select>
                {!editEmp.desigID && <p className={style.error}>Designation is required.</p>}
              </div>

              <div className={style.buttonGroup}>
                <button type="button" onClick={handleUpdateEmployee}>
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
            <button onClick={toggleAddDish} style={{ display: !Designations.length ? 'none' : 'block' }}>Add New Employee</button>
          </div>
        </div>

        <div className={style.tableWrapper}>
          <div className={style.categoryTabs}>
            {!Designations.length ? (
              <p style={{ fontSize: '30px', color: 'red', margin: 'auto' }}>Please add Designation first</p>
            ) : (

              Designations.map((category) => (
                <button
                  key={category.id}
                  className={`${style.tabButton} ${activeCategory === category.id ? style.activeTab : ""
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

export default Employee;
