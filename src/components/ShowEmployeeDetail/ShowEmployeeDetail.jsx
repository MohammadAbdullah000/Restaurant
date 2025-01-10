import React, { useState, useEffect } from "react";
import style from "./ShowEmployeeDetail.module.css";
import DataTable from "react-data-table-component";

const ShowEmployeeDetail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [noEmployeesMessage, setNoEmployeesMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  // Fetch employees for a specific designation
  async function fetchEmployee(desigId) {
    try {
      const response = await fetch(
        `https://hotelbarkat.com/Apis/employee_fetch_Api.php?desigId=${desigId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (!data.length) {
          setNoEmployeesMessage("No Employee Added");
        } else {
          const formattedEmployees = data.map((dish) => ({
            EmployeesIDS: dish.emp_card_id,
            FullName: dish.emp_name,
            Email: dish.emp_email,
            Mobile: dish.emp_mobile,
            Address: dish.emp_address,
            Salary: dish.emp_salary,
            DesignationID: desigId, // Link employee to designation
            ids: dish.emp_id,
          }));

          setEmployees((prevEmployees) => {
            // Add only new employees (filter duplicates)
            const newEmployees = formattedEmployees.filter(
              (newEmp) =>
                !prevEmployees.some((existingEmp) => existingEmp.ids === newEmp.ids)
            );
            return [...prevEmployees, ...newEmployees];
          });

          setNoEmployeesMessage("");
        }
      } else {
        console.error("Failed to fetch employees:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }


  // Fetch Designations
  useEffect(() => {
    async function fetchDesignations() {
      try {
        const response = await fetch(
          "https://hotelbarkat.com/Apis/designation_fetch_Api.php"
        );
        if (response.ok) {
          const data = await response.json();
          setDesignations(data);

          // Fetch employees for all designations
          data.forEach((designation) => fetchEmployee(designation.id));
        } else {
          console.error("Failed to fetch Designations:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching Designations:", error);
      }
    }

    fetchDesignations();
  }, []);

  // Group employees by designation
  const employeesByDesignation = designations.map((designation) => ({
    ...designation,
    employees: employees.filter(
      (employee) => employee.DesignationID === designation.id
    ),
  }));

  console.log(employeesByDesignation);





  return (
    <div className={`${style.ShowEmployee} ${style.nunito500}`}>
      <div className={style.tableContainer}>


        <div className={style.tableWrapper}>
          {employeesByDesignation.map((designation) => (
            <div key={designation.id} className={style.designationSection}>
              <h3 className={style.designationHeading} style={{ backgroundColor: "#435e78", padding: "10px", borderRadius: "5px",color:'#fff',textAlign:'center',maxWidth:'300px' }}>
                {designation.designation_name}
              </h3>
              {designation.employees && designation.employees.length > 0 ? (
                designation.employees.map((employee, index) => (
                  <div style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    maxWidth: "20%",
                    fontSize:'18px',
                    textAlign: "center",
                    marginBottom: '30px',
                    marginTop: '15px',
                    backgroundColor: "#f9f9f9",
                  }}>

                    <p key={index} className={style.employeeName} style={{ fontWeight: "bold", margin: "0 0 5px" }}>
                      {employee.FullName}
                    </p>
                    {/* <p  style={{ margin: "0", color: "#555" }}>₹{employee.Salary}</p> */}
                  </div>
                ))
              ) : (
                <p style={{textAlign:'start'}}>No Employee Added</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShowEmployeeDetail;
