import React, { useState, useEffect } from "react";
import style from './Order.module.css';
import Receipt from "../Receipt";

const Order = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [dineOrParcel, setDineOrParcel] = useState('Dine In')
  const [noDishesMessage, setNoDishesMessage] = useState("");
  const [coupon, setCoupon] = useState('')
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
          console.log('sub', subcategories);


        })
        .catch((err) => console.error("Error fetching subcategories:", err));
    }
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId) => {
    // console.log(subcategories());

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
  useEffect(() => {
    const coupon = Math.floor(Math.random() * 100)
    setCoupon(coupon)
    console.log('Coupon:', coupon);
  }, [])

  const handlePrint = () => {
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
    console.log('Total:', Total);
    // const coupon = Math.floor(Math.random() * 100)
    // setCoupon(coupon)
    // console.log('Coupon:', coupon);
  }
  const handleParcel = () => {
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



  const [PendingTable, setPendingTable] = useState([])
  useEffect(() => {
    // Fetch categories from API
    fetch("https://letzbim.com/Restaurent/Pending_Order_Table_Fetch.php")
      .then((res) => res.json())
      .then((data) => {
        // setCategories(data);
        console.log('pending table show ' + data[0].tableno)
        setPendingTable(data)
        // if (data.length > 0) setSelectedCategory(data[0].dishcat_id); // Set default category
      })
      .catch((err) => console.error("Error fetching Pending table :", err));
  }, []);


  const [selectedTable, setSelectedTable] = useState(null); // To store the selected table number
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [activeTable, setActiveTable] = useState(null); // Track active table

  const handleTableClick = (tableNo) => {
    setSelectedTable(tableNo); // Set the selected table number
    setActiveTable(tableNo); // Set active table
    setIsModalOpen(true); // Open the modal
  };

  const [PendingTableOrder, setPendingTableOrder] = useState([])
  
 // Function to close the modal
 const handleClose = () => {
  setActiveTable(null); // Reset active table
  setPendingTableOrder([]); // Clear pending orders
};


useEffect(() => {
  if (activeTable !== null) {
    fetch(
      `https://letzbim.com/Restaurent/Table_Order_Fetch_Api.php?tableNo=${activeTable}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Pending table order:" + activeTable + ' ' + data);
        setPendingTableOrder(data);
      })
      .catch((err) =>
        console.error("Error fetching Pending table Order:", err)
      );
  }
}, [activeTable]);


  return (
    <div style={{ display: "flex", minHeight: "90vh", }} className={style.nunito500}>
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
          {!categories.length ? (
            <p style={{ fontSize: '20px', color: 'white', marginTop: 10 }}>No Categories Added</p>
          ) : (
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

      {/* Column for Half Quantity */}
      {
        Array.isArray(subcategories) ? (
          <>
            <div
              style={{
                display: "flex",
                width: "50%",
                backgroundColor: "#f8f9fa",
                height: "70vh",
                flexWrap: "wrap"
              }}
            >
              <div
                style={{
                  width: "100%",
                  overflowY: "scroll",
                  padding: "10px",
                  borderRight: "1px solid #ddd",
                  height: "100%"
                }}
              >
                <h3 style={{ textAlign: "center", color: "#2C3E50", marginTop: '0.5rem' }} className={style.cinzel500}>Half Quantity</h3>
                {/* filter((dish) => dish.dish_qnty === "Half"). */}
                {subcategories.length > 0 ? (
                  <ul
                    style={{
                      listStyleType: "none",
                      marginTop: '1.5rem',
                      paddingBottom: "20px",
                      display:"flex",flexDirection:"row",flexWrap:"wrap"
                    }}
                  >
                    {subcategories
                      .map((dish) => (
                        <li
                          key={dish.dish_id}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#2C3E50",
                            marginTop: 15,
                            color: "#1A1A1A",
                            fontSize: 15,
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontWeight: 400,
                            width: "30%",height:60,
                            display: "flex",
                            justifyContent: dish.dish_qnty === "Half" ? "flex-start":"center",
                            alignItems:  dish.dish_qnty === "Half" ? "flex-start":"center",
                          }}
                          onClick={() => handleAddItem(dish)}
                        >
                          <div
                            style={{
                              backgroundColor: "#e0e0e0",
                              height: dish.dish_qnty === "Half" ? "90%" : "80%",
                              width: "100%",
                              textAlign: "center",
                              justifyContent:"center",alignItems:"center",paddingTop:12
                            }}
                          >
                            <h4>{dish.dish_name}</h4>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p
                    style={{
                      fontSize: 18,
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 30,
                    }}
                  >
                    No Half Quantity Dishes.
                  </p>
                )}
              </div>



              {/* Column for Full Quantity */}
              {/* <div
                style={{
                  width: "50%",
                  overflowY: "scroll",
                  padding: "10px",
                  height: "100%"
                }}
              >

                <h3 style={{ textAlign: "center", color: "#2C3E50", marginTop: '0.5rem' }} className={style.cinzel500} >Full Quantity</h3>
                {subcategories.filter((dish) => dish.dish_qnty === "Full").length > 0 ? (
                  <ul
                    style={{
                      listStyleType: "none",
                      paddingBottom: "20px",
                      marginTop: '1.5rem',
                    }}
                  >
                    {subcategories
                      .filter((dish) => dish.dish_qnty === "Full")
                      .map((dish) => (
                        <li
                          key={dish.dish_id}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#2C3E50",
                            marginTop: 15,
                            color: "#1A1A1A",
                            fontSize: 15,
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontWeight: 400,
                            width: "90%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => handleAddItem(dish)}
                        >
                          <div
                            style={{
                              backgroundColor: "#e0e0e0",
                              height: "100%",
                              marginBottom: '3px',
                              width: "100%",
                              padding: 10,
                              textAlign: "center",
                            }}
                          >
                            <h4>{dish.dish_name}</h4>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p
                    style={{
                      fontSize: 18,
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 30,
                    }}
                  >
                    No Full Quantity Dishes.
                  </p>
                )}

              </div> */}


              <div style={{ borderWidth: 1, height: "20vh", backgroundColor: "#ddd", width: "100%", padding: 30 }}>
                {PendingTable.length > 0 ? (
                  PendingTable.map((item, index) => (
                    <a key={index} onClick={() => handleTableClick(item.tableno)} style={{ padding: 20, backgroundColor: "red", color: "white", marginRight: 20 }}>{item.tableno}</a>
                  ))
                ) : (
                  <tr>
                    <h3 >
                      No Pending Orders
                    </h3>
                  </tr>
                )}
              </div>
            </div>


          </>
        ) : (
          <div
            style={{
              display: "flex",
              width: "50%",
              backgroundColor: "#f8f9fa",
              height: "90vh",
            }}
          >
            <p
              style={{
                fontSize: 18,
                margin: 'auto',
              }}
            >
              No Dish Is Added.
            </p>
          </div>
        )
      }


      {/* Modal */}
      {/* {isModalOpen && (
        <div
          style={{
            position: "fixed",
            // top: "50%",
            left: "59%",
            // transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            width: "40%",
            height:"80%"
          }}
        >
          <h3>Details for Table No: {selectedTable}</h3>
          <p>Additional information for table {selectedTable} can be shown here.</p>
          <button onClick={closeModal} style={{ padding: 10, marginTop: 20 }}>
            Close
          </button>
        </div>
      )} */}

      {/* Modal Overlay */}
      {/* {isModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )} */}


{activeTable !== null ? (
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
           className={`${style.separatebtn} ${dineOrParcel === "Parcel" ? style.active : ""
             }`}
           onClick={handleClose}
         >
           Close
         </button>
         <p>Coupon: {coupon} </p>
         <p>activeTable: {activeTable} </p>
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
                   fontSize: "18px",
                   marginTop: "10px",
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
           <p style={{ fontSize: 20, textAlign: 'center', marginTop: '1rem' }}>No items added On Active table.</p>
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
             width: "100%",
             gap: "10px",
             padding: "10px",
           }}
         >
           <button className={style.separatebtn} onClick={handlesaveOrder}>Save</button>
           <button className={style.separatebtn} onClick={handlePrint}><Receipt dineOrParcel={dineOrParcel} addedItems={addedItems} coupon={coupon} /></button>


           <button className={style.separatebtn}>Download</button>
           <button className={style.separatebtn}>Share</button>
         </div>
       </div>
     </div>


   </div>
      ) : (
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
              className={`${style.separatebtn} ${dineOrParcel === "Dine In" ? style.active : ""
                }`}
              onClick={handleDine}
            >
              Dine
            </button>
            <button
              className={`${style.separatebtn} ${dineOrParcel === "Parcel" ? style.active : ""
                }`}
              onClick={handleParcel}
            >
              Parcel
            </button>
            <p>Coupon: {coupon}</p>
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
                      fontSize: "18px",
                      marginTop: "10px",
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
              <p style={{ fontSize: 20, textAlign: 'center', marginTop: '1rem' }}>No items added.</p>
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
                width: "100%",
                gap: "10px",
                padding: "10px",
              }}
            >
              <button className={style.separatebtn} onClick={handlesaveOrder}>Save</button>
              <button className={style.separatebtn} onClick={handlePrint}><Receipt dineOrParcel={dineOrParcel} addedItems={addedItems} coupon={coupon} /></button>


              <button className={style.separatebtn}>Download</button>
              <button className={style.separatebtn}>Share</button>
            </div>
          </div>
        </div>


      </div>
      )}
      {/* Selected Items */}

      {/* <div
        style={{
          width: "45%",
          padding: "0 20px",
          backgroundColor: "#FFF",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100%", // Ensures content fits naturally
          }}
        >
          <div className={style.firstbuttons}>
            <button
              className={`${style.separatebtn} ${dineOrParcel === "Dine In" ? style.active : ""
                }`}
              onClick={handleDine}
            >
              Dine
            </button>
            <button
              className={`${style.separatebtn} ${dineOrParcel === "Parcel" ? style.active : ""
                }`}
              onClick={handleParcel}
            >
              Parcel
            </button>
            <p>Coupon: {coupon}</p>
          </div>

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
                      fontSize: "18px",
                      marginTop: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >

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

                    <span style={{ flexBasis: "10%", textAlign: "center" }}>
                      ₹{item.dist_rate}
                    </span>

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

                    <span style={{ flexBasis: "20%", textAlign: "center" }}>
                      ₹{item.dist_rate * item.quantity}
                    </span>

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
              <p style={{ fontSize: 20, textAlign: 'center', marginTop: '1rem' }}>No items added.</p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              backgroundColor: "#f9f9f9",
              borderTop: "1px solid #ddd",
            }}
          >

            <h3
              style={{
                margin: "0",
                textAlign: "right",
                padding: "10px",
              }}
            >
              Total Price: ₹{calculateTotalPrice()}
            </h3>

            <div
              className={style.lastbuttons}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                gap: "10px",
                padding: "10px",
              }}
            >
              <button className={style.separatebtn} onClick={handlesaveOrder}>Save</button>
              <button className={style.separatebtn} onClick={handlePrint}><Receipt dineOrParcel={dineOrParcel} addedItems={addedItems} coupon={coupon} /></button>


              <button className={style.separatebtn}>Download</button>
              <button className={style.separatebtn}>Share</button>
            </div>
          </div>
        </div>


      </div> */}



    </div>
  );
};

export default Order;
