import React, { useState, useEffect } from "react";
import style from "./ShowDishesSell.module.css";
import DataTable from "react-data-table-component";

const ShowDishesSell = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedDish, setSelectedDish] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [noExpenseMessage, setNoExpenseMessage] = useState("");
    const [noDishesMessage, setNoDishesMessage] = useState(""); // New state for no dishes message

    // Fetch categories and dishes on component mount
    useEffect(() => {
        async function fetchCategoriesAndDishes() {
            try {
                // Fetch categories first
                const categoryResponse = await fetch(
                    "https://letzbim.com/Restaurent/dish_categories_fetch_Api.php"
                );
                if (categoryResponse.ok) {
                    const categoryData = await categoryResponse.json();
                    setCategories(categoryData);

                    // Set the first category as the default selected category
                    if (categoryData.length > 0) {
                        setSelectedCategory(categoryData[0].dishcat_id);
                        fetchDishes(categoryData[0].dishcat_id); // Fetch dishes for the default category
                    }
                } else {
                    console.error("Failed to fetch categories:", categoryResponse.statusText);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }

        fetchCategoriesAndDishes();
    }, []);

    // Fetch dishes corresponding to the selected dish category
    useEffect(() => {
        if (selectedCategory) {
            fetchDishes(selectedCategory); // Fetch dishes when selectedCategory changes
        }
    }, [selectedCategory]); // Trigger whenever selectedCategory changes

    const fetchDishes = async (dishCatID) => {
        try {
            const response = await fetch(
                `https://letzbim.com/Restaurent/dishes_fetch_Api.php?dishCatID=${dishCatID}`
            );
            if (response.ok) {
                const data = await response.json();
                if (!data.length) {
                    setNoDishesMessage("No Dishes Added"); // Show the message
                    setDishes([]); // Clear dishes
                } else {
                    const formattedDishes = data.map((dish) => ({
                        name: dish.dish_name,
                        price: dish.dist_rate,
                        quantity: dish.dish_qnty,
                        category: dish.dishcat_name,
                        id: dish.dish_id,
                    }));
                    setDishes(formattedDishes);
                    console.log('dd',formattedDishes.id);
                    
                    //   console.log('a',formattedDishes);
                    setNoDishesMessage(""); // Clear the message
                    setSelectedDish(formattedDishes[0].id); // Set the first dish as selected by default
                }
            } else {
                console.error("Failed to fetch dishes:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching dishes:", error);
        }
    };

    // Fetch expenses based on selected dish and date range
    const handleGetExpense = async () => {
        try {
            const response = await fetch(
                `https://letzbim.com/Restaurent/Food_Sell_Fetch_Api.php?Odish_id=${selectedDish}&dateOne=${startDate}&dateTwo=${endDate}`
            );

            if (response.ok) {
                const data = await response.json();
                if (!data.length) {
                    setNoExpenseMessage("No Expenses Added");
                } else {
                    const formattedExpenses = data.map((expense) => ({
                        Odish_id: expense.Odish_id,
                        tableno: expense.tableno,
                        order_qnty: expense.order_qnty,
                        order_rate: expense.order_rate,
                        order_unit: expense.order_unit,
                        order_subtotal: expense.order_subtotal,
                        OaddedOn: expense.OaddedOn,
                        OAddedTime: expense.OAddedTime,
                    }));
                    setExpenses(formattedExpenses);
                    setNoExpenseMessage("");
                    console.log(expenses);

                }
            } else {
                console.error("Failed to fetch expenses:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const customStyles = {
        headCells: { style: { fontSize: "18px", fontWeight: "bold" } },
        cells: { style: { fontSize: "16px" } },
    };

    const columns = [
        { name: "Date", selector: (row) => row.OaddedOn, sortable: true },
        { name: "Time", selector: (row) => row.OAddedTime, sortable: true },
        { name: "Table No", selector: (row) => row.tableno, sortable: true },
        { name: "Quantity", selector: (row) => row.order_qnty, sortable: true },
        { name: "Rate", selector: (row) => row.order_rate, sortable: true },
        { name: "Unit", selector: (row) => row.order_unit, sortable: true },
        { name: "Sub Total", selector: (row) => row.order_subtotal, sortable: true },
    ];

    // Initialize default date range
    useEffect(() => {
        const currentDate = new Date();

        const firstDateOfMonth = new Date(
            Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1)
        );
        setStartDate(firstDateOfMonth.toISOString().split("T")[0]);

        const lastDateOfMonth = new Date(
            Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        );
        setEndDate(lastDateOfMonth.toISOString().split("T")[0]);
    }, []);
    const calculateTotalExpense = () => {
        return expenses.reduce((total, expense) => total + Number(expense.order_subtotal), 0);
    }
    return (
        <div className={style.dish}>
            <div className={`${style.cardForm} ${style.nunito500}`}>
                <h3>View Expenses</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={style.formGroupdish}>
                        <label htmlFor="cat">Category Name:</label>
                        <select
                            id="cat"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)} // Set selected category
                        >
                            {categories.map((dish) => (
                                <option key={dish.dishcat_id} value={dish.dishcat_id}>
                                    {dish.dishcat_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={style.formGroupdish}>
                        <label htmlFor="dish">Dish Name:</label>
                        <select
                            id="dish"
                            value={selectedDish}
                            onChange={(e) => setSelectedDish(e.target.value)}
                        >
                            {dishes.map((dish) => (
                                <option key={dish.id} value={dish.id}>
                                    {dish.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {noDishesMessage && (
                        <p className={style.noDishesMessage}>{noDishesMessage}</p>
                    )}
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
                    <DataTable
                        className={style.datatable}
                        columns={columns}
                        data={expenses}
                        pagination
                        highlightOnHover
                        customStyles={customStyles}
                    />

                )}
                <div className={style.totalExpense}>
                    <strong>Grand Total: </strong>₹{calculateTotalExpense()}
                </div>
            </div>
        </div>
    );
};

export default ShowDishesSell;
