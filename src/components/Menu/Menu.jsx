import React, { useEffect, useState } from "react";
import style from './Menu.module.css'
const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch categories and dishes
    useEffect(() => {
        const fetchCategoriesAndDishes = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await fetch("https://hotelbarkat.com/Apis/dish_categories_fetch_Api.php");
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                // Fetch dishes for all categories
                const dishesData = {};
                for (const category of categoriesData) {
                    const dishResponse = await fetch(
                        `https://hotelbarkat.com/Apis/dishes_fetch_Api.php?dishCatID=${category.dishcat_id}`
                    );
                    const dishData = await dishResponse.json();
                    dishesData[category.dishcat_id] = dishData;
                }

                setDishes(dishesData);
                console.log(dishesData);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchCategoriesAndDishes();
    }, []);

    return (
        <div style={{ padding: "20px" }} className={`${style.nunito500}`}>
            {/* <h1>Dish Categories</h1> */}
            {loading && <p>Loading categories and dishes...</p>}
            {!loading && categories.length === 0 && <p>No categories found.</p>}
            {categories.map((category) => (
                <div key={category.dishcat_id} style={{ marginBottom: "20px", }}>
                    <h2 style={{ backgroundColor: "#435e78", padding: "10px", maxWidth:'300px',borderRadius: "5px",color:'#fff',textAlign:'center' }}>
                        {category.dishcat_name}
                    </h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px",justifyContent:'start' }}>
                        {dishes[category.dishcat_id]?.length > 0 ? (
                            dishes[category.dishcat_id].map((dish) => (
                                <div
                                    key={dish.dish_id}
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "30px",
                                        maxWidth: "20%",
                                        fontSize:'18px',
                                        textAlign: "center",
                                        marginBottom:'30px',
                                        marginTop:'15px',
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    <p style={{ fontWeight: "bold", margin: "0 0 5px" }}>{dish.dish_name}</p>
                                    <p style={{ margin: "0", color: "#555" }}>₹{dish.dist_rate}</p>
                                </div>
                            ))
                        ) : (
                            <p>No dishes found for this category.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Menu;
