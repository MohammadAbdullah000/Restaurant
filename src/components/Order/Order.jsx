import axios from "axios";
import { FaTrash, FaEye } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import React, { useState, useEffect, useRef } from "react";
import style from './Order.module.css';
import Receipt from "../Receipt";
import ModalReceipt from "../ModalReciept";

const Order = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [dineOrParcel, setDineOrParcel] = useState('Dine In')
  const [noDishesMessage, setNoDishesMessage] = useState("");
  const [coupon, setCoupon] = useState('')
  const [tableOcc, setTableOcc] = useState('')
  const [selectedTable, setSelectedTable] = useState(null); // To store the selected table number
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [activeTable, setActiveTable] = useState(null); // Track active table
  const [activeTableclick, setActiveTableclick] = useState(null); // Track active table
  const [activeCouponTable, setActiveCouponTable] = useState(null); // Track active table

  useEffect(() => {
    // Fetch categories from API
    fetch("https://hotelbarkat.com/Apis/dish_categories_fetch_Api.php")
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
      fetch(`https://hotelbarkat.com/Apis/dishes_fetch_Api.php?dishCatID=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {

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
    // if (!activeCouponTable) {
    // If no active coupon from handleTableClick, fetch a new coupon
    fetchcoupon();
    // }
  }, []);

  async function fetchcoupon() {
    try {
      const response = await fetch('https://hotelbarkat.com/Apis/UniqueNUmberFetchApi.php');
      const data = await response.json();
      setCoupon(data.Coupon_No); // Set coupon for API usage
      console.log('Fetched Coupon:', data);
    } catch (error) {
      console.error('Error fetching coupon:', error);
    }
  }
  const [activeCoupon, setactivecoupon] = useState('')
  const handleTableClick = (tableNo, couponnumber) => {
    setSelectedTable(tableNo); // Set the selected table number
    setActiveTableclick(tableNo); // Set active table
    setTableOcc(tableNo); // Set active table
    if (couponnumber) {
      setCoupon(couponnumber); // Use provided coupon if available
      console.log('Using existing coupon:', couponnumber);
    } else {
      console.log('No coupon provided, using fetched coupon:', coupon);
    }
    // setIsModalOpen(true); // Open the modal if needed
  };

  const handleParcel = () => {
    setDineOrParcel('Parcel')
  }

  const [payment, setPayment] = useState('')
  const handleChange = (event) => {
    setPayment(event.target.value); // Update state with selected value
  };
  console.log('pay', payment);


  const handlesaveOrder = async () => {


    try {
      // Ensure tableOcc and addedItems are valid
      if (!tableOcc) {
        alert("Please select a table before submitting the order.");
        return;
      }

      if (!addedItems || addedItems.length === 0) {
        alert("Please add at least one item before submitting the order.");
        return;
      }

      // Prepare the items with subtotal
      const updatedItems = addedItems.map((item) => ({
        dish_id: item.dish_id,
        dish_qnty: item.dish_qnty,
        dist_rate: item.dist_rate,
        quantity: item.quantity,
        subtotal: item.quantity * item.dist_rate, // Calculate subtotal
        status: "0",
        couponNo: coupon,
        dineNo: tableOcc,
        pay_method: payment,
      }));

      // Calculate the total price
      const Total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      // console.log('update',addedItems);

      // Prepare the payload
      const payload = {
        items: updatedItems,
        total: Total,
      };

      // Make the API call
      const response = await fetch(
        "https://hotelbarkat.com/Apis/Order_Submit_Api.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Order submitted successfully:", result);
        alert("Order submitted successfully");
        fetchPendingTable();
        fetchPendingTableOrder();
        setAddedItems([]);
      } else {
        console.error("Error submitting order:", result.message);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error in handlesaveOrder:", error);
      alert("An error occurred while submitting the order");
    }

    // }
  };
  const handlesavePrintOrder = async () => {
    if (!payment) {
      alert("Please Select Payment Mode!!!")
      return
    }
    if (!addedItems || addedItems.length === 0) {
      alert("Please add at least one item before submitting the order.");
      return;
    } else {

      try {
        // Prepare the items with subtotal
        const updatedItems = addedItems.map((item) => ({
          dish_id: item.dish_id,
          dish_qnty: item.dish_qnty,
          dist_rate: item.dist_rate,
          quantity: item.quantity,
          subtotal: item.quantity * item.dist_rate, // Calculate subtotal
          status: '1',
          couponNo: coupon,
          dineNo: tableOcc,
          pay_method: payment,
        }));

        // Calculate the total price
        const Total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
        console.log('nn', addedItems);


        // Prepare the payload
        const payload = {
          items: updatedItems,
          total: Total,
          // items: mergedItems,
          // total: mergedTotal,
          // dineNo: tableOcc,
          // couponNo: coupon,
        };

        // Make the API call
        const response = await fetch("https://hotelbarkat.com/Apis/Order_Submit_Api.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          // alert("Order submitted successfully");
          handlePrint(receiptRef)
          setAddedItems([])
          fetchcoupon()
          fetchPendingTable()
          // fetchPendingTableOrder()
        } else {
          console.error("Error submitting order:", result.message);
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error in handlesaveOrder:", error);
        alert("An error occurred while submitting the order");
      }
    }
  };



  const [PendingTable, setPendingTable] = useState([])
  useEffect(() => {
    // Fetch categories from API
    fetchPendingTable()
  }, []);
  const fetchPendingTable = (async) => {

    fetch("https://hotelbarkat.com/Apis/Pending_Order_Table_Fetch.php")
      .then((res) => res.json())
      .then((data) => {
        // setCategories(data);
        // console.log('pending table show ' + data[0].tableno)
        setPendingTable(data)
        // if (data.length > 0) setSelectedCategory(data[0].dishcat_id); // Set default category
      })
      .catch((err) => console.error("Error fetching Pending table :", err));
  }






  const closeModal = () => {
    setIsModalOpen(false)
  }
  const allTables = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const pendingTableNumbers =
    PendingTable && PendingTable.length > 0
      ? PendingTable.map((table) => table.tableno)
      : [];

  const visibleTables = allTables.filter((table) => !pendingTableNumbers.includes(table));

  const [PendingTableOrder, setPendingTableOrder] = useState([])

  // Function to close the modal
  const handleClose = () => {
    setActiveTableclick(null); // Reset active table
    setPendingTableOrder([]); // Clear pending orders
  };

  const fetchPendingTableOrder = (async) => {
    if (activeTable !== null) {
      fetch(
        `https://hotelbarkat.com/Apis/Table_Order_Fetch_Api.php?tableNo=${activeTable}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Pending table order:" + activeTable + ' ' + data);
          setPendingTableOrder(data);
          console.log('pending', PendingTableOrder);

        })
        .catch((err) =>
          console.error("Error fetching Pending table Order:", err)
        );
    }
  }

  useEffect(() => {
    if (activeTable !== null) {
      fetch(
        `https://hotelbarkat.com/Apis/Table_Order_Fetch_Api.php?tableNo=${activeTable}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Pending table order:" + activeTable + ' ' + data);
          setPendingTableOrder(data);
          console.log('pending', PendingTableOrder);

        })
        .catch((err) =>
          console.error("Error fetching Pending table Order:", err)
        );
    }
  }, [activeTable]);
  const [activeTablecolor, setActiveTablecolor] = useState('')
  const handleaddtable = (table) => {
    setActiveTablecolor(table)
    setTableOcc(table)
  }
  const handlePendingPrint = async () => {
    if (!payment) {
      alert('Please make payment first')
    }
    else {
      try {
        // Prepare the payload
        const payload = new URLSearchParams({
          dineID: selectedTable, // Replace with the state or variable for the selected table
          CouponNum: activeCoupon, // Replace with the state or variable for the active coupon
          paymethod: payment, // Replace with the state or variable for the payment method
        });

        // Make the API call
        const response = await fetch("https://hotelbarkat.com/Apis/Pendig_Order_Finish_Api.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload.toString(), // Convert the payload to a URL-encoded string
        });

        // Parse the response
        const result = await response.json();

        if (response.ok) {
          setIsModalOpen(false)
          handlePrint(receiptRef)
          fetchcoupon()
          fetchPendingTable()
          // alert("Order finished successfully!");
          // PendingTable()
          // Perform any additional actions like updating the UI
        } else {
          console.error("Error finishing order:", result.message);
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error in handlePendingPrint:", error);
        alert("An error occurred while finishing the order.");
      }
    }

  };


  const handleEyeClick = (tableNo, couponnumber) => {
    setIsModalOpen(true)
    setactivecoupon(couponnumber)

    setSelectedTable(tableNo); // Set the selected table number
    setActiveTable(tableNo);

  }
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Event listener for online
    const handleOnline = () => setIsOnline(true);

    // Event listener for offline
    const handleOffline = () => setIsOnline(false);

    // Attach listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  const receiptRef = useRef();

  const handlePrint = (ref) => {
    if (!payment) {
      return
    }

    else {
      if (ref.current) {
        const originalContents = document.body.innerHTML; // Save original page content
        const printContents = ref.current.innerHTML; // Get the printable content

        // Replace the page's content with the printable content
        document.body.innerHTML = `
          <html>
            <head>
              <title>Print</title>
              <style>
                /* Add styles for your print layout here */
                body {
                  font-family: Arial, sans-serif;
                  padding: 15px;
                  width: 59mm; /* Set the width for printing */
                }
                .table-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                }
                .table-container {
                  width: 100%;
                  border-collapse: collapse;
                }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `;

        window.print(); // Trigger the print dialog
        document.body.innerHTML = originalContents; // Restore the original content
        window.location.reload(); // Reload to ensure the original state is restored
      }
    }
  };


  // Calculate total price
  const totalPrice =
    PendingTableOrder && PendingTableOrder.length > 0
      ? PendingTableOrder.reduce(
        (total, item) => total + item.dist_rate * item.order_unit,
        0
      )
      : 0;

  const totalPricePrint = addedItems.reduce(
    (total, item) => total + item.dist_rate * item.quantity,
    0)

  const now = new Date();
  const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now
    .getFullYear()
    .toString()
    .slice(2)}`;
  const formattedTime = `${now.getHours()}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const handleDeletePending = (orderId) => async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const response = await axios.post(
        'https://hotelbarkat.com/Apis/Order_Delete_Api.php',
        new URLSearchParams({ order_id: orderId }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (response.data.successmessage === 'success') {
        // alert('Order deleted successfully!');
        // Update the PendingTableOrder array to remove the deleted order
        const updatedOrders = PendingTableOrder.filter(order => order.order_id !== orderId);
        setPendingTableOrder(updatedOrders); // Ensure to update the state
        fetchPendingTable()
        setIsModalOpen(false)
        // If no orders are left, we will show the "No pending orders" message.
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error deleting the order:', error);
      alert('An error occurred while deleting the order.');
    }
  };



  return (
    <div style={{ display: "flex", minHeight: "90vh", }} className={`${style.nunito500} ${style.modall}`}>
      <div>
        {!isOnline && (
          alert('Offline')
        )}
      </div>
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
                  fontSize: 20,
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
                  width: "49.5%",
                  overflowY: "scroll",
                  padding: "10px",
                  height: "100%"
                }}
              >

                <h3 style={{ textAlign: "center", color: "#2C3E50", marginTop: '0.5rem' }} className={style.cinzel500} >Half Quantity</h3>
                {subcategories.filter((dish) => dish.dish_qnty === "Half").length > 0 ? (
                  <ul
                    style={{
                      listStyleType: "none",
                      paddingBottom: "20px",
                      marginTop: '1.5rem',
                    }}
                  >
                    {subcategories
                      .filter((dish) => dish.dish_qnty === "Half")
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
                    No Half Quantity Dishes.
                  </p>
                )}

              </div>
              <hr />
              <div
                style={{
                  width: "49.5%",
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

              </div>


              <div style={{ borderWidth: 1, display: 'flex', flexWrap: 'wrap', height: "20vh", backgroundColor: "#ddd", width: "100%", padding: 30 }}>
                {PendingTable.length > 0 ? (
                  PendingTable.map((item, index) => (
                    <div style={{ border: '2px solid black', borderRadius: 5, height: 50, width: 100, marginLeft: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10, cursor: 'pointer' }}>

                      <a key={index} onClick={() => handleTableClick(item.tableno, item.O_CouponNo)} style={{ padding: 13, textAlign: 'center', borderRadius: 3, width: '50%', backgroundColor: "#435e78", color: "white", }}>{item.tableno}</a>
                      <span
                        onClick={() => handleEyeClick(item.tableno, item.O_CouponNo)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          // marginInline: 6,
                          width: '50%',
                          fontSize: 20,
                          color: "#2C3E50",
                          // border:'2px solid black'
                        }}
                      >
                        <FaEye />
                      </span>
                    </div>

                  ))
                ) : (

                  <h3 >
                    No Pending Orders
                  </h3>

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
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            left: "30%",
            top: "25%",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            width: "40%",
            maxHeight: "85vh",
            overflowY: "auto",

          }}
        >
          <div className={style.modall}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>Details for Table No: {selectedTable}</h3>
                <p>Additional information for table {selectedTable} can be shown here.</p>
              </div>
              <p onClick={closeModal} style={{ cursor: "pointer", padding: 10, fontSize: 25 }}>
                &times;
              </p>
            </div>
            <div className={style.header}>
              <p className={style.name}>Dish Name</p>
              <p className={style.name}>Quantity</p>
              <p className={style.name}>Subtotal</p>
              <p className={style.name}>Dish Rate</p>
              <p className={style.name}>Order Unit</p>
              <p className={style.name}>Action</p>
            </div>
            {PendingTableOrder && PendingTableOrder.length > 0 ? (
              PendingTableOrder.map((order) => (
                <div className={style.header} key={order.id}>
                  <p>{order.dish_name}</p>
                  <p>{order.dish_qnty}</p>
                  <p>{order.order_subtotal}</p>
                  <p>{order.dist_rate}</p>
                  <p>{order.order_unit}</p>
                  <p
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      padding: "5px",
                    }} onClick={handleDeletePending(order.order_id)}>                        <FaTrash />
                  </p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', marginBlock: '10px' }}>No pending orders.</p> // Show this if the array is empty
            )}


            <div
              style={{
                textAlign: "end",
                marginRight: 50,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="totalamount"
            >
              <div className={style.payment}>
                <input
                  type="radio"
                  name="payment"
                  id="online"
                  value="Online"
                  onChange={handleChange}
                  checked={payment === "Online"} // Control the checked state
                />
                <label htmlFor="online">Online</label>

                <input
                  type="radio"
                  name="payment"
                  id="cash"
                  value="Cash"
                  onChange={handleChange}
                  checked={payment === "Cash"} // Control the checked state
                />
                <label htmlFor="cash">Cash</label>
              </div>
              <p style={{ marginTop: 10 }}>
                <strong>Total Price: ₹{totalPrice}</strong>
              </p>
            </div>

            <button
              className={style.separatebtn}
              onClick={() => { handlePendingPrint() }} // Print content when clicked
            >
              Print
            </button>
          </div>
          {/* Printable content */}

        </div>

      )}

      {/* Modal Overlay */}
      {isModalOpen && (
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
      )}


      {activeTableclick !== null ? (
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

              <p
                className={`${style.separatebtnback} ${dineOrParcel === "Parcel" ? style.active : ""
                  }`}
                onClick={handleClose}
              >
                <IoMdArrowRoundBack />
              </p>
              <p>Coupon: {coupon} </p>
              <p style={{ marginLeft: 20 }}>Active Table: {tableOcc} </p>
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
                          flexBasis: "5%",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        <FaTrash />
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
              {/* <div className={style.payment}>
            <input
              type="radio"
              name="payment"
              id="online"
              value="Online"
              onChange={handleChange}
              checked={payment === "Online"} // Control the checked state
            />
            <label htmlFor="online">Online</label>

            <input
              type="radio"
              name="payment"
              id="cash"
              value="Cash"
              onChange={handleChange}
              checked={payment === "Cash"} // Control the checked state
            />
            <label htmlFor="cash">Cash</label>
          </div> */}


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

                {/* <button className={style.separatebtn} onClick={handlePrint}><Receipt dineOrParcel={dineOrParcel} addedItems={addedItems} coupon={coupon}  payment={payment} /></button> */}


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
            {dineOrParcel === 'Dine In' ? (
              <div className={style.alltables}>
                {visibleTables.map((table) => (
                  <button
                    key={table}
                    className={style.tablebutton}
                    onClick={() => handleaddtable(table)}
                    style={{
                      backgroundColor: activeTablecolor === table ? "#2C3E50" : "#435e78",
                    }}
                  >
                    {table}
                  </button>
                ))}
              </div>
            ) : (
              null
            )}


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
                          flexBasis: "5%",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        <FaTrash />
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
              {dineOrParcel === 'Parcel' ? (<div className={style.payment}>
                <input
                  type="radio"
                  name="payment"
                  id="online"
                  value="Online"
                  onChange={handleChange}
                  checked={payment === "Online"} // Control the checked state
                />
                <label htmlFor="online">Online</label>

                <input
                  type="radio"
                  name="payment"
                  id="cash"
                  value="Cash"
                  onChange={handleChange}
                  checked={payment === "Cash"} // Control the checked state
                />
                <label htmlFor="cash">Cash</label>
              </div>) : null}
              <h3
                style={{
                  margin: "0",
                  textAlign: "right",
                  // padding: "10px",
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
                {/* <button className={style.separatebtn} onClick={handlesaveOrder}>Save</button> */}
                {dineOrParcel === 'Dine In' ? (<button className={style.separatebtn} onClick={handlesaveOrder}>Save</button>) : (<button className={style.separatebtn} onClick={() => { handlesavePrintOrder() }}>Print</button>)}



                <button className={style.separatebtn}>Download</button>
                <button className={style.separatebtn}>Share</button>
              </div>
              <div ref={receiptRef} className={style.printt}>
                <p style={{ textAlign: 'center', paddingTop: 5 }}>Hotel Barkat</p>

                <h4 style={{ textAlign: 'center', marginBottom: 20 }}>Coupon No: {coupon}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p>Date: {formattedDate}</p>
                    <p>Time: {formattedTime}</p>
                  </div>
                  <div style={{ textAlign: 'end', fontSize: '15px' }}>
                    <p><strong>{dineOrParcel}</strong></p>

                  </div>
                </div>

                <div className="table-container" style={{ marginTop: 20, display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {/* Header Row */}
                  <div className="table-row" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <div style={{ width: '60%' }}>Item</div>
                    <div style={{ width: '20%' }}>Qty</div>
                    <div style={{ width: '20%' }}>Price</div>
                  </div>

                  {/* Table Data */}
                  {dineOrParcel === 'Parcel' ? (
                    addedItems.length > 0 ? (
                      addedItems.map((item, index) => (
                        <div
                          className="table-row"
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                          }}
                        >
                          <div style={{ width: '60%' }}>{item.dish_name}</div>
                          <div style={{ width: '20%' }}>{item.quantity}</div>
                          <div style={{ width: '20%' }}>₹{item.dist_rate}</div>
                        </div>
                      ))
                    ) : (
                      <div></div>
                    )
                  ) : (
                    PendingTableOrder.length > 0 ? (
                      PendingTableOrder.map((item, index) => (
                        <div
                          className="table-row"
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                          }}
                        >
                          <div style={{ width: '60%' }}>{item.dish_name}</div>
                          <div style={{ width: '20%' }}>{item.order_unit}</div>
                          <div style={{ width: '20%' }}>₹{item.dist_rate}</div>
                        </div>
                      ))
                    ) : (
                      <></>
                    )
                  )}


                </div>

                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>

                  <p> Payment: <strong>{payment}</strong></p>
                  <p>Total: <strong>₹{dineOrParcel === 'Parcel' ? totalPricePrint : totalPrice} </strong></p>

                </div>
                <p style={{ textAlign: 'center' }}>(All taxes included)</p>
              </div>
            </div>
          </div>


        </div>
      )
      }



    </div>
  );
};

export default Order;
