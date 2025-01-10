import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component'; // Import DataTable
import style from './Income.module.css';

const Income = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filters, setFilters] = useState({
        paymentMode: '',
        startDate: '',
        endDate: '',
    });
    const [categories, setCategories] = useState([]);
    const [selectedDish, setSelectedDish] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [dishes, setDishes] = useState([]);

    // Fetch Orders from API
    const fetchOrders = async () => {
        try {
            const response = await fetch('https://hotelbarkat.com/Apis/Order_Records_Fetch_Api.php');
            const data = await response.json();
            setOrders(data);
            setFilteredOrders(data); // Initialize with all data
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        async function fetchCategoriesAndDishes() {
            try {
                const categoryResponse = await fetch("https://hotelbarkat.com/Apis/dish_categories_fetch_Api.php");
                if (categoryResponse.ok) {
                    const categoryData = await categoryResponse.json();
                    setCategories(categoryData);

                    if (categoryData.length > 0) {
                        setSelectedCategory(categoryData[0].dishcat_id);
                        fetchDishes(categoryData[0].dishcat_id);
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

    const fetchDishes = async (dishCatID) => {
        try {
            const response = await fetch(
                `https://hotelbarkat.com/Apis/dishes_fetch_Api.php?dishCatID=${dishCatID}`
            );
            const data = await response.json();
            setDishes(data.map(dish => ({ id: dish.dish_id, name: dish.dish_name })));
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchDishes(selectedCategory);
        }
    }, [selectedCategory]);

    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle Submit
    const handleincome = () => {
        let filtered = orders;

        if (filters.paymentMode) {
            filtered = filtered.filter(order => order.pay_method === filters.paymentMode);
        }

        if (selectedDish) {
            filtered = filtered.filter(order => order.dish_id === selectedDish);
        }

        if (filters.startDate) {
            filtered = filtered.filter(order => new Date(order.OaddedOn) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            filtered = filtered.filter(order => new Date(order.OaddedOn) <= new Date(filters.endDate));
        }

        setFilteredOrders(filtered);
    };

    const customStyles = {
        headCells: { style: { fontSize: "18px", fontWeight: "bold" } },
        cells: { style: { fontSize: "16px" } },
    };

    // Calculate Grand Total
    const grandTotal = filteredOrders.reduce((sum, order) => sum + parseFloat(order.order_subtotal || 0), 0);

    const handleReset = async () => {
        try {
            const response = await axios.post('https://hotelbarkat.com/Apis/Receipt_Reset_Api.php');
    
            if (response.status === 200 && response.data.success) {
               alert('Successfully Reset the coupons');
            } else {
                console.warn('Failed to submit data:', response.data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error while submitting data to the database:', error.message);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
        }
    };
    return (
        <div style={{ padding: '20px' }}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly',gap:'1rem'}}>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }} className={`${style.cardForm} ${style.nunito500}`}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={style.formGroupdish}>
                        <label htmlFor="cat">Payment Mode:</label>
                        <select name="paymentMode" value={filters.paymentMode} onChange={handleInputChange}>
                            <option value="">Select Payment Mode</option>
                            <option value="Cash">Cash</option>
                            <option value="Online">Online</option>
                        </select>
                    </div>
                    <div className={style.formGroupdish}>
                        <label htmlFor="cat">Select Category:</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.dishcat_id} value={cat.dishcat_id}>
                                    {cat.dishcat_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={style.formGroupdish}>
                        <label htmlFor="cat">Dish Name:</label>
                        <select value={selectedDish} onChange={(e) => setSelectedDish(e.target.value)}>
                            <option value="">Select Dish</option>
                            {dishes.map(dish => (
                                <option key={dish.id} value={dish.id}>
                                    {dish.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={style.formGroupdish}>
                        <label htmlFor="cat">Start Date:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={style.formGroupdish}>
                        <label htmlFor="cat">End Date:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={style.buttonGroup}>
                        <button type="button" onClick={handleincome}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <div className={style.buttonGroup}>
                <button onClick={handleReset}>Reset</button>
                </div>
        </div>

            <div>
                <DataTable
                    columns={[
                        { name: 'Order ID', selector: row => row.order_id, center: true },
                        { name: 'Dish Name', selector: row => row.dish_name, center: true },
                        { name: 'Payment Mode', selector: row => row.pay_method, center: true },
                        { name: 'Quantity', selector: row => row.order_qnty, center: true },
                        { name: 'Rate', selector: row => row.order_rate, center: true },
                        { name: 'Subtotal', selector: row => row.order_subtotal, center: true },
                        { name: 'Date', selector: row => row.OaddedOn, center: true },
                    ]}
                    data={filteredOrders}
                    pagination
                    highlightOnHover
                    customStyles={customStyles}
                />
            </div>

            {/* Grand Total */}
            <div className={style.totalExpense}>
                Grand Total: <strong> ₹{grandTotal.toFixed(2)}</strong>
            </div>
        </div>
    );
};

export default Income;
