import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import style from "./Expense.module.css";
import axios from "axios";

const Expense = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDishIsOpen, setAddDishIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [expCategory, setExpenseCategory] = useState("");
  const [expDes, setExpDes] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [id,setId] = useState('')
  // const [employeeSalary, setEmployeeSalary] = useState("");
  // const [employees, setEmployees] = useState([]);
  const [venderName, setVenderName] = useState([]);
  const [expenses, setExpenses] = useState([]);
  // const [activeCategory, setActiveCategory] = useState(null);
  const [noExpenseMessage, setNoExpenseMessage] = useState("");
    const [editDishIsOpen, setEditDishIsOpen] = useState(false);
      const [editExp,setEditExp] = useState([])
  // Fetch Employees
  useEffect(() => {
    fetchExpenses()
    }, []);
    async function fetchExpenses() {
      try {
        const response = await fetch("https://letzbim.com/Restaurent/Expenses_Fetch_Api.php");
        if (response.ok) {
          const data = await response.json();
          setExpenses(data)
          console.log("API Response:", data); // Log the full API response
          console.log("Length of data:", data.length); // Log the length
    if(!data.length){
      setNoExpenseMessage("No Expenses Added"); // Show the message

    }
          {
            const formattedEmployees = data.map((expenses) => ({
              
              exp_id:expenses.exp_id,
              expensCat: expenses.expensCat,
              expensInfo: expenses.expensInfo,
              expnAmount: expenses.expnAmount,
              expensMethod: expenses.expensMethod,
              venderName: expenses.venderName,
              date: expenses.expdate,
            }));
            setExpenses(formattedEmployees);
            console.log('h',formattedEmployees);
            
            setNoExpenseMessage(""); // Clear the message
          }
        } 
        else {
          console.error("Failed to fetch employees:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    
    
    
    // Fetch Designations
    // useEffect(() => {
    //   async function fetchDesignations() {
    //     try {
    //       const response = await fetch(
    //         "https://letzbim.com/Restaurent/designation_fetch_Api.php"
    //       );
    //       if (response.ok) {
    //         const data = await response.json();
    //         console.log('aaa',data);
    //         setDesignations(data);
            
    //         console.log('ca',Designations);
            
  
    //         // Set the first category as the default active category
    //         if (data.length > 0) {
    //           setActiveCategory(data[0].id);
    //           fetchExpenses(data[0].id); // Fetch Employees for the default category
    //         }
    //       } else {
    //         console.error("Failed to fetch Designations:", response.statusText);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching Designations:", error);
    //     }
    //   }
  
    //   fetchDesignations();
    // }, []);
  
  

  function toggleAddDish() {
    setAddDishIsOpen(!addDishIsOpen);
  }
  function toggleEditDish() {
    setEditDishIsOpen(!editDishIsOpen);
  }
  // useEffect(() => {
  //   // Fetch unique number from the API when the component mounts
  //   const fetchUniqueID = async () => {
  //     try {
  //       const response = await axios.get("https://letzbim.com/Restaurent/UniqueNUmberFetchApi.php");
  //       if (response.data && response.data.employee_ID) {
  //         setEmployeeID(response.data.employee_ID); // Assuming the response contains the unique ID in this structure
  //       } else {
  //         console.error("Invalid response structure", response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching unique ID:", error);
  //     }
  //   };

  //   fetchUniqueID();
  // }, [employees]);


  const handleEdit = async (exp_id) => {
    try {
      // Construct the API URL with the given dishcat_id
      const apiUrl = `https://letzbim.com/Restaurent/Expense_Edit_Fetch_Api.php?exp_id=${exp_id}`;
  
      // Make the GET request to fetch the category details
      const response = await axios.get(apiUrl);
  console.log('rr',response);
  
      // Check if the response is successful
      if (response.data) {
        setEditExp(response.data)
        console.log('nasa',response.data);
        
  console.log('efit',editExp);
  
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
  
  async function handleAddExpense() {
    const formData = new URLSearchParams();
    formData.append("expensCat", expCategory);
    formData.append("expensInfo",expDes);
    formData.append("expnAmount",amountSpent);
    formData.append("expensMethod",paymentMethod);
    formData.append("venderName", venderName);
    formData.append("date", date);
   
    try {
      const response = await fetch("https://letzbim.com/Restaurent/Expenses_Add_Api.php", {
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
           setExpenses((prevExpenses=[]) => [
            ...prevExpenses,
            {
              expensCat: expCategory,
              expensInfo: expDes,
              expnAmount: amountSpent,
              expensMethod: paymentMethod,
              venderName: venderName,
              date: date,
            },
          ]);
          // Clear form fields
          setDate("")
          setExpenseCategory("");
          setExpDes("");
          setAmountSpent("");
          setPaymentMethod("");
          setVenderName("");
          // setEmployeeSalary("");
          // setdesginationID("")
  
          // Close the form
          toggleAddDish();
  
          // Fetch Employees again to update the table
          fetchExpenses(); // Ensure we fetch Employees for the active category
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
    fetchExpenses(dishCatID); // Fetch Employees for the selected category
  };

  const handleDelete = async (empID) => {
    try {
      const response = await fetch("https://letzbim.com/Restaurent/Expense_Delete_Api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ exp_id: empID }),
      });
  
      const result = await response.json();
      // console.log('ffffffff',desigId)
  
      if (result.successmessage === "success") {
        setExpenses((prevEmployees) => prevEmployees.filter((dish) => dish.emp_id !== empID));
        // console.log('aa',activeCategory);
        
        fetchExpenses();
      } else {
        alert(result.message || "Failed to delete employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee.");
    }
  };
  
const columns = [
  { name: "Date", selector: (row) => row.date, sortable: true },
  { name: "Expense Category", selector: (row) => row.expensCat, sortable: true },
  { name: "Expense Detail", selector: (row) => row.expensInfo, sortable: true },
  { name: "Expense Amount", selector: (row) => row.expnAmount, sortable: true },
  { name: "Method", selector: (row) => row.expensMethod, sortable: true },
  { name: "Vendor Name", selector: (row) => row.venderName, sortable: true },
  {
    name: "",
    cell: (row) => (
      <button
       className={style.deleteButton}
       onClick={() => {
        handleEdit(row. exp_id);
        toggleEditDish();}}
      >
        Edit
      </button>
    ),
    ignoreRowClick: true,
    allowoverflow: true,
    button: true,
  },
  {
    name: "",
    cell: (row) => (
      <button
       className={style.deleteButton}
       onClick={() => {
        handleDelete(row. exp_id);
        ;}}
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
      style: { fontSize: "18px", fontWeight: "bold" },
    },
    cells: {
      style: { fontSize: "16px" },
    },
  };

  // const filteredEmployees = employees.filter((dish) =>
  //   dish.FullName?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  useEffect(() => {
    if (editExp) {
          setDate(editExp.expdate || '');
          setExpenseCategory(editExp.expensCat || '');
          setExpDes(editExp.expensInfo || '');
          setAmountSpent(editExp.expnAmount || '');
          setPaymentMethod(editExp.expensMethod || '');
          setVenderName(editExp.venderName || '');
      console.log(editExp);
      
    }
  }, [editExp]);
   const handleInputChange = (e) => {
    setEditDish(e.target.value); // Update the value as user types
  };
  const handleUpdateExpense = async () => {
    // Ensure designation ID is selected
    // if (!desginationID && !editExp?.desigID) {
    //   alert("Please select a designation.");
    //   return;
    // }
  
    // Prepare form data for the API request
    // const formData = new URLSearchParams();
  
    // Using the state values or the existing editExp fields as fallback
    // formData.append("expnsID", expCategory || editExp.expensCat);
    // formData.append("expensCat", expCategory || editExp.expensCat);
    // formData.append("expensInfo", expDes || editExp.expensInfo);
    // formData.append("expnAmount", amountSpent || editExp.expnAmount);
    // formData.append("expensMethod", paymentMethod || editExp.expensMethod);
    // formData.append("venderName", venderName || editExp.venderName);
    // formData.append("date", date || editExp.expdate);
    // formData.append("DesigId", desginationID || editExp.desigID);
  
    try {
      const response = await fetch("https://letzbim.com/Restaurent/Expenses_Update_Api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          expnsID: editExp.exp_id,
          expensCat: editExp.expensCat,
          expensInfo: editExp.expensInfo,
          expnAmount: editExp.expnAmount,
          expensMethod: editExp.expensMethod,
          venderName: editExp.venderName,
          date: editExp.expdate,
          // DesigId: editExp.desigID,
        }),
      });
  
      const result = await response.json();
      // if (response.ok) {
        if (result.successmessage) {
          setExpenses((prevEmployees) =>
            prevEmployees.map((emp) =>
              emp.exp_id === (editExp.exp_id)
                ? {
                    ...emp,
          exp_id: editExp.exp_id,
                    expensCat:expCategory || editExp.expensCat,
                    expensInfo:expDes || editExp.expensInfo,
                    expnAmount: amountSpent || editExp.expnAmount,
                    expensMethod: paymentMethod || editExp.expensMethod,
                    venderName: venderName || editExp.venderName,
                    date: date || editExp.expdate,
                    // emp_id:employeeID||editExp.emp_id,
                    // emp_name: employeeName || editExp.emp_name,
                    // emp_email: employeeEmail || editExp.emp_email,
                    // emp_mobile: employeeMobile || editExp.emp_mobile,
                    // emp_address: employeeAddress || editExp.emp_address,
                    // emp_salary: employeeSalary || editExp.emp_salary,
                    // desigID: Designations.find(
                    //   (desig) => desig.id === (desginationID || editExp.desigID)
                    // )?.designation_name || "",
                  }
                : emp
            )
          );
  
          setDate("")
          setExpenseCategory("");
          setExpDes("");
          setAmountSpent("");
          setPaymentMethod("");
          setVenderName("");
  
          toggleEditDish(); // Close the edit form
          fetchExpenses(); // Refresh employee list
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
      <h3>Add New Expense</h3>
      <form onSubmit={(e) => e.preventDefault()}>
      {/* <div className={style.formGroupdish}>
          <label htmlFor="id">ID:</label>
          <input
            type="number"
            id="id"
            value={employeeID}
            readOnly 
            // onChange={(e) => setEmployeeID(e.target.value)}
            required
          />
        </div> */}
        <div className={style.formGroupdish}>
          <label htmlFor="fullName">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            // onChange={(e) => handleInputChange("emp_name", e.target.value)}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="expcat">Expense Category:</label>
          <input
            type="text"
            id="expcat"
            value={expCategory}
            // onChange={(e) => handleInputChange("emp_email", e.target.value)}
            onChange={(e) => setExpenseCategory(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="expdet">Expense Detail:</label>
          <input
            type="text"
            id="expdet"
            value={expDes}
            // onChange={(e) => handleInputChange("emp_mobile", e.target.value)}
            onChange={(e) => setExpDes(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="spent">Amount Spent:</label>
          <input
            type="number"
            id="spent"
            value={amountSpent}
            // onChange={(e) => handleInputChange("emp_address", e.target.value)}
            onChange={(e) => setAmountSpent(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="method">Payment Method:</label>
          <input
            type="text"
            id="method"
            value={paymentMethod}
            // onChange={(e) => handleInputChange("emp_salary", e.target.value)}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroupdish}>
          <label htmlFor="vename">Vendor Name:</label>
          <input
            type="text"
            id="venname"
            value={venderName}
            // onChange={(e) => handleInputChange("emp_salary", e.target.value)}
            onChange={(e) => setVenderName(e.target.value)}
            required
          />
        </div>
        {/* <div className={style.formGroupdish}>
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
                </div> */}
        <div className={style.buttonGroup}>
          <button type="button" onClick={handleAddExpense}>
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
      {/* <div className={style.formGroupdish}>
        <label htmlFor="id">ID:</label>
        <input
          type="number"
          id="id"
          value={editExp.emp_card_id || ""}
          readOnly
          required
        />
      </div> */}

      <div className={style.formGroupdish}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={editExp.expdate || ""}
          onChange={(e) => setEditExp((prev) => ({ ...prev, expdate: e.target.value }))}
          required
        />
      </div>

      <div className={style.formGroupdish}>
        <label htmlFor="email">Expense Cateogry:</label>
        <input
          type="text"
          id="email"
          value={editExp.expensCat || ""}
          onChange={(e) => setEditExp((prev) => ({ ...prev, expensCat: e.target.value }))}
          required
        />
      </div>

      <div className={style.formGroupdish}>
        <label htmlFor="mobile">Expense Detail:</label>
        <input
          type="text"
          id="mobile"
          value={editExp.expensInfo || ""}
          onChange={(e) => setEditExp((prev) => ({ ...prev, expensInfo: e.target.value }))}
          required
        />
      </div>

      <div className={style.formGroupdish}>
        <label htmlFor="address">Amount Spent:</label>
        <input
          type="number"
          id="address"
          value={editExp.expnAmount || ""}
          onChange={(e) => setEditExp((prev) => ({ ...prev, expnAmount: e.target.value }))}
          required
        />
      </div>

      <div className={style.formGroupdish}>
        <label htmlFor="salary">Payment Method:</label>
        <input
          type="text"
          id="salary"
          value={editExp.expensMethod || ""}
          onChange={(e) => setEditExp((prev) => ({ ...prev, expensMethod: e.target.value }))}
          required
        />
      </div>
      <div className={style.formGroupdish}>
        <label htmlFor="salary">Vendor Name:</label>
        <input
          type="text"
          id="salary"
          value={editExp.venderName || ""}
          onChange={(e) => setEditExp((prev) => ({ ...prev, venderName: e.target.value }))}
          required
        />
      </div>

      {/* <div className={style.formGroupdish}>
        <label htmlFor="designation">Designation:</label>
        <select
          id="designation"
          value={editExp.desigID || ""}
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
        {!editExp.desigID && <p className={style.error}>Designation is required.</p>}
      </div> */}

      <div className={style.buttonGroup}>
        <button type="button" onClick={handleUpdateExpense}>
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
          <button onClick={toggleAddDish} 
          //  style={{ display: !Designations.length ? 'none' : 'block' }}
           >Add New Employee</button>
        </div>
        </div>

        <div className={style.tableWrapper}>
        <div className={style.categoryTabs}>
  {/* {!Designations.length?(
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
  )))} */}
</div>
<div>
  {noExpenseMessage ? (
    <p className={style.noExpenseMessage}>{noExpenseMessage}</p>
  ) : (
    <DataTable
      className={style.datatable}
      columns={columns}
      data={expenses}
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

export default Expense;
