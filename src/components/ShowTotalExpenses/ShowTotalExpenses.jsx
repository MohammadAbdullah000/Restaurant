import React, { useState, useEffect } from "react";
import style from "./ShowTotalExpenses.module.css";
import DataTable from "react-data-table-component";

const ShowTotalExpenses = () => {
    const [expenseCategory, setExpenseCategory] = useState("Food and Inventory");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [noExpenseMessage, setNoExpenseMessage] = useState("");

    async function handleGetExpense() {
        try {
            const response = await fetch(
                `https://hotelbarkat.com/Apis/Expense_Record_Fetch_Api.php?expenses=${expenseCategory}&dateOne=${startDate}&dateTwo=${endDate}`
            );

            if (response.ok) {
                const data = await response.json();
                console.log("API Response:", data);

                if (!data.length) {
                    setNoExpenseMessage("No Expenses Added");
                } else {
                    const formattedExpenses = data.map((expense) => ({
                        exp_id: expense.exp_id,
                        expensCat: expense.expensCat,
                        expensInfo: expense.expensInfo,
                        expnAmount: parseFloat(expense.expnAmount) || 0,
                        expensMethod: expense.expensMethod,
                        venderName: expense.venderName,
                        date: expense.expdate,
                    }));
                    setExpenses(formattedExpenses);
                    setNoExpenseMessage("");
                }
            } else {
                console.error("Failed to fetch expenses:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    }

    const calculateTotalExpense = () => {
        return expenses.reduce((total, expense) => total + expense.expnAmount, 0).toFixed(2);
    };

    const customStyles = {
        headCells: {
            style: { fontSize: "18px", fontWeight: "bold" },
        },
        cells: {
            style: { fontSize: "16px" },
        },
    };

    const columns = [
        { name: "Date", selector: (row) => row.date, sortable: true },
        { name: "Expense Category", selector: (row) => row.expensCat, sortable: true },
        { name: "Expense Detail", selector: (row) => row.expensInfo, sortable: true },
        { name: "Expense Amount", selector: (row) => row.expnAmount, sortable: true },
        { name: "Method", selector: (row) => row.expensMethod, sortable: true },
        { name: "Vendor Name", selector: (row) => row.venderName, sortable: true },
    ];

    useEffect(() => {
        // Calculate the first date of the current month
        const currentDate = new Date();

        // First day of the current month
        const firstDateOfMonth = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
        const formattedFirstDate = firstDateOfMonth.toISOString().split("T")[0];
        setStartDate(formattedFirstDate);

        // Last day of the current month
        const lastDateOfMonth = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
        const formattedLastDate = lastDateOfMonth.toISOString().split("T")[0];
        setEndDate(formattedLastDate);
    }, []);

    return (
        <div className={style.dish}>
            <div className={`${style.cardForm} ${style.nunito500}`}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={style.formGroupdish}>
                        <label htmlFor="expcat">Expense Category:</label>
                        <select
                            id="expcat"
                            value={expenseCategory}
                            onChange={(e) => setExpenseCategory(e.target.value)}
                            required
                        >
                            <option value="Food and Inventory">Food and Inventory</option>
                            <option value="Salary">Salary</option>
                            <option value="Utilities and Maintenance">Utilities and Maintenance</option>
                            <option value="Rent">Rent</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                        </select>
                    </div>
                    <div className={style.formGroupdish}>
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={style.formGroupdish}>
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={style.buttonGroup}>
                        <button type="button" onClick={handleGetExpense}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <div className={style.tableWrapper}>
                {noExpenseMessage ? (
                    <p className={style.noExpenseMessage}>{noExpenseMessage}</p>
                ) : (
                    <>
                        <DataTable
                            className={style.datatable}
                            columns={columns}
                            data={expenses}
                            pagination
                            highlightOnHover
                            customStyles={customStyles}
                        />
                        <div className={style.totalExpense}>
                            <strong>Grand Total: </strong>₹{calculateTotalExpense()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShowTotalExpenses;
