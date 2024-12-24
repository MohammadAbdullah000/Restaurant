import React, { useState } from "react";
import style from "./Expense.module.css";

const Expense = () => {
  const [category, setCategory] = useState("");
  const [isStaffExpense, setIsStaffExpense] = useState(false);
  const [isUtilityExpense, setIsUtilityExpense] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setIsStaffExpense(selectedCategory === "Staff Salaries");
    setIsUtilityExpense(selectedCategory === "Utility Bills");
  };

  return (
    <div className={style.expenseTrackerForm}>
      {/* <h2>Expense Tracker</h2> */}
      <form>
        {/* General Information Section */}
        <div className={style.formSection}>
          <h3>General Information</h3>
          <label>
            Date of Expense:
            <input type="date" name="expenseDate" required />
          </label>
          {/* <label>
            Time of Expense:
            <input type="time" name="expenseTime" required />
          </label> */}
          <label>
            Expense Category:
            <select name="category" required>
              <option value="">Select a Category</option>
              <option value="Food & Ingredients">Food & Ingredients</option>
              <option value="Beverages">Beverages</option>
              <option value="Staff Salaries">Staff Salaries</option>
              <option value="Utility Bills">Utility Bills</option>
              <option value="Rent/Mortgage">Rent/Mortgage</option>
              <option value="Marketing/Advertising">Marketing/Advertising</option>
              <option value="Maintenance & Repairs">Maintenance & Repairs</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </label>
        </div>

        {/* Expense Details Section */}
        <div className={style.formSection}>
          <h3>Expense Details</h3>
          <label>
            Expense Description:
            <textarea
              name="description"
              placeholder="Provide specific details about the expense"
              required
            ></textarea>
          </label>
          <label>
            Amount Spent:
            <input type="number" name="amount" placeholder="Enter amount" required />
          </label>
          {/* <label>
            Currency:
            <select name="currency" required>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label> */}
          <label>
            Payment Method:
            <select name="paymentMethod" required>
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Vendor Name: (Optional)
            <input type="text" name="vendor" placeholder="Enter vendor name" />
          </label>
          <label>
            Upload Invoice: (Optional)
            <input type="file" name="invoice" accept=".pdf, .jpg, .png" />
          </label>
        </div>

        {/* Staff-Related Expense Section */}
        {/* {isStaffExpense && (
          <div className={style.formSection}>
            <h3>Staff-Related Expense</h3>
            <label>
              Designation:
              <input type="text" name="designation" placeholder="Enter role/designation" />
            </label>
            <label>
              Employee Name:
              <input type="text" name="employeeName" placeholder="Enter employee name" />
            </label>
            <label>
              Salary Paid:
              <input type="number" name="salary" placeholder="Enter salary amount" />
            </label>
            <label>
              Payment Month:
              <input type="month" name="paymentMonth" />
            </label>
            <label>
              Payment Mode:
              <select name="paymentMode">
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </label>
          </div>
        )} */}

        {/* Utility Expense Section */}
        {/* {isUtilityExpense && (
          <div className={style.formSection}>
            <h3>Utility Expense</h3>
            <label>
              Utility Type:
              <select name="utilityType">
                <option value="Electricity">Electricity</option>
                <option value="Gas">Gas</option>
                <option value="Water">Water</option>
              </select>
            </label>
            <label>
              Billing Month:
              <input type="month" name="billingMonth" />
            </label>
            <label>
              Bill Amount:
              <input type="number" name="billAmount" placeholder="Enter bill amount" />
            </label>
            <label>
              Utility Provider Name:
              <input type="text" name="providerName" placeholder="Enter provider name" />
            </label>
            <label>
              Account Number:
              <input type="text" name="accountNumber" placeholder="Enter account number" />
            </label>
          </div>
        )} */}

        {/* Recurring Expense Section */}
        {/* <div className="form-section">
          <h3>Recurring Expense</h3>
          <label>
            <input
              type="checkbox"
              name="recurring"
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Mark as Recurring
          </label>
          {isRecurring && (
            <>
              <label>
                Frequency:
                <select name="frequency">
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Annually">Annually</option>
                </select>
              </label>
              <label>
                Start Date:
                <input type="date" name="startDate" />
              </label>
              <label>
                End Date (Optional):
                <input type="date" name="endDate" />
              </label>
            </>
          )}
        </div> */}

        {/* Submit Buttons */}
        <div className={style.formButtons}>
          <button type="submit">Add Expense</button>
          <button type="reset">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default Expense;
