import React, { useState, useEffect } from "react";
import style from './Order.module.css';
import Receipt from "../Receipt";

const Order = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [dineOrParcel,setDineOrParcel] = useState('Dine In')
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
  const handleDine = () => {
    setDineOrParcel("Dine In");
  };
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


  const handlePrint=()=>{
    let count = 0
    // addedItems.forEach((item)=>{
    //   console.log('Dish Name:',item.dish_name);
    //   console.log('Dish Rate:',item.dist_rate);
    //   console.log('Dish Quantity:',item.quantity);
    //   console.log('Dish qnty:',item.dish_qnty);
    //   console.log('Dish Subtotal:',item.dist_rate * item.quantity)
    //   // console.log(item.dish_name);
      
    // })
    console.log(addedItems)
    const Total = calculateTotalPrice()
    console.log('Total:',Total);
    const coupon =  Math.floor(Math.random()*100)
    console.log('Coupon:',coupon);
  }
const handleParcel=()=>{
  setDineOrParcel('Parcel')
}
// const handlesaveOrder=()=>{
//   // console.log(addedItems);
//   // Add subtotal to each item
//   const updatedItems = addedItems.map((item) => ({
//     ...item,
//     subtotal: item.quantity * item.dist_rate, // Assuming each item has `quantity` and `price`
//   }));
//   // {item.dist_rate * item.quantity}
//   // Log the updated items
//   console.log("Updated Items:", updatedItems);
//   // Calculate total price
//   const Total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
//   console.log("Total:", Total); 
// }

const handlesaveOrder = async () => {
  try {
    // Prepare the items with subtotal
    const updatedItems = addedItems.map((item) => ({
      dish_id: item.dish_id,
      dish_qnty: item.dish_qnty,
      dist_rate: item.dist_rate,
      quantity: item.quantity,
      subtotal: item.quantity * item.dist_rate, // Calculate subtotal
      status: '0',
      couponNo: '125',
      dineNo: '8',
    }));

    // Calculate the total price
    const Total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Prepare the payload
    const payload = {
      items: updatedItems,
      total: Total,
    };

    // Make the API call
    const response = await fetch("https://letzbim.com/Restaurent/Order_Submit_Api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Order submitted successfully:", result);
      alert("Order submitted successfully");
    } else {
      console.error("Error submitting order:", result.message);
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error in handlesaveOrder:", error);
    alert("An error occurred while submitting the order");
  }
};


  // async function handleAddExpense() {
  //   const formData = new URLSearchParams();
  //   formData.append("expensCat", expCategory);
  //   formData.append("expensInfo",expDes);
  //   formData.append("expnAmount",amountSpent);
  //   formData.append("expensMethod",paymentMethod);
  //   formData.append("venderName", venderName);
  //   formData.append("date", date);
   
  //   try {
  //     const response = await fetch("https://letzbim.com/Restaurent/Expenses_Add_Api.php", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: formData.toString(),
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log(result);
  //       if (result.successmessage) {
  //         // Add the new dish to the state directly
  //          setExpenses((prevExpenses=[]) => [
  //           ...prevExpenses,
  //           {
  //             expensCat: expCategory,
  //             expensInfo: expDes,
  //             expnAmount: amountSpent,
  //             expensMethod: paymentMethod,
  //             venderName: venderName,
  //             date: date,
  //           },
  //         ]);
  //         console.log('success')
  //       } else {
  //         alert("Failed to add dish: " + result.errmessage);
  //         console
  //       }
  //     } else {
  //       alert("API Error: " + response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error adding dish:", result.errmessage);
  //     alert("Failed to add dish. Please try again later.");
  //   }
  // }

  // Update the state if needed
  // setAddedItems(updatedItems);
  

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
                  fontWeight: 400,
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
          padding: "0 20px",
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
  {/* <h3 style={{ marginTop: "20px" }}>Added Items</h3> */}
  <div className={style.firstbuttons}>
  <button
        className={`${style.separatebtn} ${
          dineOrParcel === "Dine In" ? style.active : ""
        }`}
        onClick={handleDine}
      >
        Dine
      </button>
      <button
        className={`${style.separatebtn} ${
          dineOrParcel === "Parcel" ? style.active : ""
        }`}
        onClick={handleParcel}
      >
        Parcel
      </button>
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
              fontSize:"18px",
              marginTop:"10px",
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
        width:"100%",
        gap: "10px",
        padding: "10px",
      }}
    >
      <button className={style.separatebtn} onClick={handlesaveOrder}>Save</button>
      <button className={style.separatebtn} onClick={handlePrint}><Receipt dineOrParcel={dineOrParcel} addedItems={addedItems} /></button>
    

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
