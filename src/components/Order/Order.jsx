import React, { useState, useEffect } from "react";
import style from './Order.module.css';

const Order = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [noDishesMessage, setNoDishesMessage] = useState("");

  useEffect(() => {
    // Fetch categories from API
    fetch("https://letzbim.com/Restaurent/dish_categories_fetch_Api.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].dishcat_id); // Set default category
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Fetch subcategories when category is selected
      fetch(`https://letzbim.com/Restaurent/dishes_fetch_Api.php?dishCatID=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          // if(!data.length){
          //   setNoDishesMessage("No Dishes Added"); // Show the message
      
          // }
          
          // const filteredSubcategories = data.filter(
          //   (dish) => dish.dishcat_id === selectedCategory
          // );
          // if(!data.length){
          //   setNoDishesMessage("No Dishes Added"); // Show the message
      
          // }
          setSubcategories(data);
          // console.log(data)
          // console.log('sub',subcategories);

          
        })
        .catch((err) => console.error("Error fetching subcategories:", err));
    }
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAddItem = (dish) => {
    setAddedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.dish_id === dish.dish_id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.dish_id === dish.dish_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...dish, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (dishId) => {
    setAddedItems((prevItems) =>
      prevItems.filter((item) => item.dish_id !== dishId)
    );
  };

  const incrementQuantity = (dishId) => {
    setAddedItems((prevItems) =>
      prevItems.map((item) =>
        item.dish_id === dishId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (dishId) => {
    setAddedItems((prevItems) =>
      prevItems
        .map((item) =>
          item.dish_id === dishId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotalPrice = () => {
    return addedItems.reduce((total, item) => total + item.dist_rate * item.quantity, 0);
  };

  return (
    <div style={{ display: "flex", minHeight: "90vh" }}>
      {/* Left Sidebar */}
      <div
        style={{
          width: "15%",
          backgroundColor: "#2C3E50",
          padding: "20px",
          borderRight: "1px solid #ddd",
        }}
      >
        <ul style={{ listStyleType: "none", padding: 0 }}>
         {!categories.length?(
          <p style={{fontSize:'20px', color:'white',marginTop:10}}>No Categories Added</p>
         ):(
          categories.map((category) => (
            <li
              key={category.dishcat_id}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor:
                  selectedCategory === category.dishcat_id ? "#e0e0e0" : "transparent",
                color: selectedCategory === category.dishcat_id ? "#1A1A1A" : "#fff",
                marginBottom: "5px",
              }}
              onClick={() => handleCategoryClick(category.dishcat_id)}
            >
              {category.dishcat_name}
            </li>
          ))
         )}
        </ul>
      </div>

      {/* Subcategories */}
                  
      <div style={{overflowY:'scroll', width: "40%", backgroundColor: "#f8f9fa",height:'90vh' }}>
        {subcategories.length > 0 ? (
          <ul
            style={{
              listStyleType: "none",
              paddingBottom: "20px", 
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {subcategories.map((dish) => (
              <li
                key={dish.dish_id}
                style={{
                  cursor: "pointer",
                  // height: 80,
                  backgroundColor: "#2C3E50",
                  marginTop: 15,
                  width: "27%",
                  color: "#1A1A1A",
                  fontSize: 20,
                  marginLeft: 20,
                  fontWeight: "400",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => handleAddItem(dish)}
              >
                <h4
                  style={{
                    backgroundColor: "#e0e0e0",
                    height: "92%",
                    width: "100%",
                    marginTop: "2.5%",
                    padding: 10,
                    textAlign: "center",
                  }}
                >
                  {dish.dish_name}
                </h4>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{
            fontSize: 20,
            display:'flex',
            justifyContent: 'center',
            marginTop:30
            // alignContent:'center',
          }}>No Added Dishes.</p>
        )}
      </div>

      {/* Selected Items */}
      <div
        style={{
          width: "45%",
          padding: "20px",
          backgroundColor: "#FFF",
        }}
      >
        {/* Display Added Items */}
        <div
  style={{
    display: "flex",
    flexDirection: "column",
    minHeight: "100%", // Ensures content fits naturally
  }}
>
  {/* Header Section */}
  <h3 style={{ marginTop: "20px" }}>Added Items</h3>
  <div className={style.firstbuttons}>
    <button className={style.separatebtn}>Dine</button>
    <button className={style.separatebtn}>Parcel</button>
  </div>

  {/* Items Section */}
  <div style={{ flex: "1" }}>
    {addedItems.length > 0 ? (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {addedItems.map((item) => (
          <li
            key={item.dish_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {/* Item Name - 40% */}
            <span
              style={{
                flexBasis: "40%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {item.dish_name}
            </span>

            {/* Item Price - 10% */}
            <span style={{ flexBasis: "10%", textAlign: "center" }}>
              ₹{item.dist_rate}
            </span>

            {/* Quantity Controls - 20% */}
            <div
              style={{
                flexBasis: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => decrementQuantity(item.dish_id)}
                style={{
                  backgroundColor: "#e0e0e0",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px",
                  marginRight: "5px",
                }}
              >
                -
              </button>
              <span style={{ margin: "0 10px" }}>{item.quantity}</span>
              <button
                onClick={() => incrementQuantity(item.dish_id)}
                style={{
                  backgroundColor: "#e0e0e0",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px",
                }}
              >
                +
              </button>
            </div>

            {/* Subtotal - 20% */}
            <span style={{ flexBasis: "20%", textAlign: "center" }}>
              ₹{item.dist_rate * item.quantity}
            </span>

            {/* Delete Button - 10% */}
            <button
              onClick={() => handleRemoveItem(item.dish_id)}
              style={{
                flexBasis: "10%",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: "5px 10px",
                textAlign: "center",
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p style={{fontSize:20,textAlign:'center'}}>No items added.</p>
    )}
  </div>

  {/* Bottom Section (Total Price and Buttons) */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      backgroundColor: "#f9f9f9",
      borderTop: "1px solid #ddd",
    }}
  >
    {/* Total Price */}
    <h3
      style={{
        margin: "0",
        textAlign: "right",
        padding: "10px",
      }}
    >
      Total Price: ₹{calculateTotalPrice()}
    </h3>

    {/* Last Buttons */}
    <div
      className={style.lastbuttons}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        padding: "10px",
      }}
    >
      <button className={style.separatebtn}>Save</button>
      <button className={style.separatebtn}>Print</button>
      <button className={style.separatebtn}>Download</button>
      <button className={style.separatebtn}>Share</button>
    </div>
  </div>
</div>


      </div>
    </div>
  );
};

export default Order;
