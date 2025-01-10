// import React, { useState, useEffect } from 'react';

// const Slider = () => {
//   const [categories, setCategories] = useState([]);
//   const [dishes, setDishes] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Fetch categories and dishes
//   useEffect(() => {
//     const fetchCategoriesAndDishes = async () => {
//       try {
//         // Fetch categories
//         const categoriesResponse = await fetch(
//           "https://hotelbarkat.com/Apis/dish_categories_fetch_Api.php"
//         );
//         const categoriesData = await categoriesResponse.json();
//         setCategories(categoriesData);

//         // Fetch dishes for all categories
//         const dishesData = {};
//         for (const category of categoriesData) {
//           const dishResponse = await fetch(
//             `https://hotelbarkat.com/Apis/dishes_fetch_Api.php?dishCatID=${category.dishcat_id}`
//           );
//           const dishData = await dishResponse.json();
//           dishesData[category.dishcat_id] = dishData;
//         }

//         setDishes(dishesData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchCategoriesAndDishes();
//   }, []);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       {categories.map((category) => (
//         <div key={category.dishcat_id} style={{ marginBottom: "30px" }}>
//           {/* Category Name */}
//           <h2
//             style={{
//               textAlign: "left",

//               padding: "10px 20px",
//               borderRadius: "5px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {category.dishcat_name}
//           </h2>

//           {/* Dishes for the Category */}
//           <div
//             style={{
//               display: "flex",
//               overflowX: "auto",
//               gap: "10px",
//               marginTop: "10px",
//               padding: "10px 0",
//             }}
//           >
//             {dishes[category.dishcat_id]?.length > 0 ? (
//               dishes[category.dishcat_id].map((dish) => (
//                 <div
//                   key={dish.dish_id}
//                   style={{
//                     border: "1px solid #ddd",
//                     borderRadius: "8px",
//                     padding: "20px",
//                     minWidth: "200px",
//                     textAlign: "center",
//                     backgroundColor: "#f9f9f9",
//                   }}
//                 >
//                   <p style={{ fontWeight: "bold", margin: "0 0 5px" }}>
//                     {dish.dish_name}
//                   </p>
//                   {/* Uncomment if you want to show the price */}
//                   {/* <p style={{ margin: "0", color: "#555" }}>₹{dish.dist_rate}</p> */}
//                 </div>
//               ))
//             ) : (
//               <p>No dishes found.</p>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Slider;

// import biryaniRice from "../../assests/biryani rice.jpg";
// import biryani1kg from "../../assests/biryani1kg.jpg";
// import chicken65 from "../../assests/Chicken 65 (Gravy).jpg";
// import chicchickenbiryaniken65 from "../../assests/chicken biryani.jpg";
// import ChickenBreast from "../../assests/Chicken Breast.jpg";
// import ChickenChilly from "../../assests/Chicken Chilly.jpg";
// import ChickenCrispy from "../../assests/Chicken Crispy.jpg";
// import ChickenCurry from "../../assests/Chicken Curry.jpg";
// import ChickenLeg from "../../assests/Chicken Leg.jpg";
// import ChickenEggRoll from "../../assests/Chicken Egg Roll.jpg";
// import ChickenPakoda from "../../assests/Chicken Pakoda.jpg";
// import Eggcurry2lachhaparatha from "../../assests/Egg curry + 2 lachha paratha.jpg";
// import ChickenRoll from "../../assests/Chicken Roll.jpg";
// import ChickenTandoori from "../../assests/Chicken Tandoori.jpg";
// import EggCurry from "../../assests/Egg Curry.jpg";
// import EggRoll from "../../assests/Egg Roll.jpg";
// import Paneer from "../../assests/Paneer masala + 2 lachha Paratha.jpg";
// import PaneerMasalaCurry from "../../assests/Paneer Masala Curry.jpg";
// import PaneerRoll from "../../assests/Paneer Roll.jpg";
// import special from "../../assests/Tawa Chicken + 2 lachha paratha + Chicken Biryani (half).jpg";
// import tawa from "../../assests/Tawa Chicken + 2 lachha paratha.jpg";
// import VegFriedRice from "../../assests/ ";
// import VegRoll from "../../assests/Veg Roll.jpg";
// import VegSchezwanRice from "../../assests/Veg Schezwan Rice.jpg";
import React from "react";
import style from './Slider.module.css'
const Slider = () => {
  // Manually defined data
  const data = [
    {
      category: "Biryani",
      dishes: [
        // { name: "Chicken Biryani (H)", img: "https://via.placeholder.com/150" },
        { name: "Chicken Biryani", img: 'https://hotelbarkat.com/imgs/chicken%20biryani.jpg' },
        // { name: "Biryani Rice (H)", img: "https://via.placeholder.com/150" },
        { name: "Biryani Rice", img: 'https://hotelbarkat.com/imgs/biryani%20rice.jpg' },
        { name: "Biryani 1 kg", img: 'https://hotelbarkat.com/imgs/biryani1kg.jpg' },
      ],
    },
    {
      category: "Chicken Fry",
      dishes: [
        { name: "Chicken Tandoori", img: 'https://hotelbarkat.com/imgs/Chicken%20Tandoori.jpg' },
        { name: "Chicken Pakoda", img: 'https://hotelbarkat.com/imgs/Chicken%20Pakoda.jpg' },
        { name: "Chicken Leg", img: 'https://hotelbarkat.com/imgs/Chicken%20Tandoori.jpg' },
        { name: "Chicken Breast", img: 'https://hotelbarkat.com/imgs/Chicken%20Breast.jpg' },
        { name: "Chicken Crispy", img: 'https://hotelbarkat.com/imgs/Chicken%20Crispy.jpg' },
      ],
    },
    {
      category: "Main Course",
      dishes: [
        { name: "Tawa Chicken + 2 lachha paratha", img: 'https://hotelbarkat.com/imgs/Tawa%20Chicken%20+%202%20lachha%20paratha.jpg' },
        { name: "Paneer masala + 2 lachha Paratha", img: 'https://hotelbarkat.com/imgs/Paneer%20masala%20+%202%20lachha%20Paratha.jpg' },
        { name: "Egg curry + 2 lachha paratha", img: 'https://hotelbarkat.com/imgs/Egg%20curry%20+%202%20lachha%20paratha.jpg' },
      ],
    },
    {
      category: "Rolls",
      dishes: [
        { name: "Paneer Roll", img: 'https://hotelbarkat.com/imgs/Paneer%20Roll.jpg' },
        { name: "Veg Roll", img: 'https://hotelbarkat.com/imgs/Veg%20Roll.jpg' },
        { name: "Egg Roll", img: 'https://hotelbarkat.com/imgs/Egg%20Roll.jpg' },
        { name: "Chicken Roll", img: 'https://hotelbarkat.com/imgs/Chicken%20Roll.jpg' },
        { name: "Chicken Egg Roll", img: 'https://hotelbarkat.com/imgs/Chicken%20Egg%20Roll.jpg' },
      ],
    },
    {
      category: "Barkat Combo",
      dishes: [
        {
          name: "Tawa Chicken + 2 lachha paratha + Chicken Biryani (half)",
          img: 'https://hotelbarkat.com/imgs/Tawa%20Chicken%20+%202%20lachha%20paratha%20+%20Chicken%20Biryani%20(half).jpg',
        },
      ],
    },
    {
      category: "Curry",
      dishes: [
        { name: "Chicken Curry", img: 'https://hotelbarkat.com/imgs/Chicken%20Curry.jpg' },
        { name: "Egg Curry", img: 'https://hotelbarkat.com/imgs/Egg%20Curry.jpg' },
        { name: "Paneer Masala Curry", img: 'https://hotelbarkat.com/imgs/Paneer%20Masala%20Curry.jpg' },
      ],
    },
    {
      category: "Chinese",
      dishes: [
        { name: "Chicken 65 (Gravy)", img: 'https://hotelbarkat.com/imgs/Chicken%2065%20(Gravy).jpg' },
        // { name: "Chicken 65 (Dry)", img: "https://via.placeholder.com/150" },
        { name: "Chicken Chilly (Gravy)", img: 'https://hotelbarkat.com/imgs/Chicken%20Chilly.jpg' },
        // { name: "Chicken Chilly (Dry)", img: "https://via.placeholder.com/150" },
        { name: "Veg Fried Rice", img: 'https://hotelbarkat.com/imgs/Veg%20Fried%20Rice.jpg' },
        { name: "Veg Schezwan Rice", img: 'https://hotelbarkat.com/imgs/Veg%20Schezwan%20Rice.jpg' },
      ],
    },

  ];

  return (
    <div className={style.slider}>
      {data.map((category, index) => (
        <div key={index} style={{ marginBottom: "30px" }}>
          {/* Category Name */}
          <h2
            style={{
              textAlign: "left",
              // padding: "10px 20px",
              borderRadius: "5px",
              whiteSpace: "nowrap",
              fontWeight: 'bold'
            }}
            className={style.cinzel500}
          >
            {category.category}
          </h2>

          {/* Dishes for the Category */}
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "10px",
              // marginTop: "10px",
              padding: "10px 0",
            }}
          >
            {category.dishes.map((dish, dishIndex) => (
              <div
                key={dishIndex}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "30px",
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                  maxWidth: '400px'

                }}
              >
                <div
                  style={{
                    width: "200px", // Set a fixed width
                    height: "200px", // Equal height to maintain square ratio
                    marginBottom: "10px",
                    overflow: "hidden", // Prevent image overflow
                    borderRadius: "8px", // Match border radius
                    margin: 'auto'
                  }}
                >
                  <img
                    src={dish.img}
                    alt={dish.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Maintain aspect ratio and cover the container
                    }}
                  />
                </div>
                <p style={{ fontWeight: "bold", margin: "0 0 5px", fontSize: '20px', marginTop: '10px' }} className={style.nunito500}>{dish.name}</p>
              </div>

            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
