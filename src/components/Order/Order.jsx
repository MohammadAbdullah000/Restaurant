import React, { useState } from "react";

const Order = () => {
  // Categories, subcategories, and prices
  const menuData = {
    biryani: [
      { name: "Veg Biryani", price: 80 },
      { name: "Chicken Biryani", price: 150 },
      { name: "Mutton Biryani", price: 200 },
      { name: "Mutton Biryani", price: 200 },
      { name: "Mutton Biryani", price: 200 },
    ],
    roti: [
      { name: "Plain Roti", price: 10 },
      { name: "Butter Roti", price: 15 },
      { name: "Garlic Naan", price: 25 },
    ],
    beverages: [
      { name: "Tea", price: 20 },
      { name: "Coffee", price: 30 },
      { name: "Cold Drink", price: 40 },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState('biryani');
  const [addedItems, setAddedItems] = useState([]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubCategoryClick = (subcategory) => {
    handleAddItem(subcategory);
  };

  const handleAddItem = (subcategory) => {
    setAddedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === subcategory.name);
      if (existingItem) {
        return prevItems.map((item) =>
          item.name === subcategory.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...subcategory, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (itemName) => {
    setAddedItems((prevItems) =>
      prevItems.filter((item) => item.name !== itemName)
    );
  };

  const incrementQuantity = (itemName) => {
    setAddedItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (itemName) => {
    setAddedItems((prevItems) =>
      prevItems
        .map((item) =>
          item.name === itemName && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotalPrice = () => {
    return addedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Sidebar */}
      <div
        style={{
          width: "15%",
          backgroundColor: "#1A1A1A",
          padding: "20px",
          borderRight: "1px solid #ddd",
        }}
      >
        {/* <h3>Categories</h3> */}
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {Object.keys(menuData).map((category) => (
            <li
              key={category}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: selectedCategory === category ? "#e0e0e0" : "transparent",
                color: selectedCategory === category ? "#1A1A1A" : "#fff",
                marginBottom: "5px",
              }}
              onClick={() => handleCategoryClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories */}
      <div
        style={{
          width: "40%",
          padding: "20px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* <h3>Subcategories</h3> */}
        {selectedCategory ? (
          <ul style={{ listStyleType: "none", padding: "20px",borderWidth:1 ,display:"flex",flexDirection:"row",flexWrap:"wrap",}}>
            {menuData[selectedCategory].map((subcategory) => (
              <li
                key={subcategory.name}
                style={{
                  cursor: "pointer",
                  height:80,
                backgroundColor:"#1A1A1A",marginTop:15,
                width:"27%",color:"#1A1A1A",fontSize:20,marginLeft:20,fontWeight:"400",justifyContent:"center",alignItems:"center"
                }}
                onClick={() => handleSubCategoryClick(subcategory)}
              >
                <h4 style={{backgroundColor:"#e0e0e0",height:"92%",width:"100%",marginTop:"2.5%",padding:10}}>{subcategory.name}</h4>
              </li>
            ))}
          </ul>
        ) : (
          <p>Select a category to view subcategories.</p>
        )}
      </div>

      {/* Selected Subcategory and Add Item */}
      <div
        style={{
          width: "45%",
          padding: "20px",
          backgroundColor: "#FFF",
        }}
      >
        {/* Display Added Items */}
        <h3 style={{ marginTop: "20px" }}>Added Items</h3>
        {addedItems.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {addedItems.map((item) => (
              <li
                key={item.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <span>
                  {item.name} - ₹{item.price}
                </span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => decrementQuantity(item.name)}
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
                    onClick={() => incrementQuantity(item.name)}
                    style={{
                      backgroundColor: "#e0e0e0",
                      border: "none",
                      cursor: "pointer",
                      padding: "5px 10px",
                    }}
                  >
                    +
                  </button>
                  <span
                  style={{
                     
                      padding: "5px 10px",
                    }}>₹{item.price * item.quantity}</span>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.name)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px 10px",
                    marginLeft: "10px",
                  }}
                >
                  Remove
                </button>
              </li>

            ))}
        <h3 style={{ marginTop: "20px" }}>Total Price: ₹{calculateTotalPrice()}</h3>
          </ul>
        ) : (
          <p>No items added.</p>
        )}
        {/* Total Price */}
      </div>
    </div>
  );
};

export default Order;
