import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import style from './History.module.css'
const History = () => {
    const [coupons, setCoupons] = useState({
        todaysCoupons: [],
        last7DaysCoupons: [],
    });

    const [selectedCouponDetails, setSelectedCouponDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasPrinted, setHasPrinted] = useState(false); // Track if printed
    const componentRef = useRef(); // This ref is assigned to the printable content.
    const receiptRef = useRef();

    // Updated handlePrint function
    // Updated handlePrint function
    const handlePrint = () => {
        if (receiptRef.current) {
            const originalContents = document.body.innerHTML; // Save original page content
            const printContents = receiptRef.current.innerHTML; // Get the printable content

            // Replace the page's content with the printable content
            document.body.innerHTML = `
            <html>
              <head>
                <title>Print</title>
                <style>
                  /* Add styles for your print layout here */
                  body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    width: 59mm; /* Set the width for printing */
                    font-size: 10px; /* Smaller font size for print */
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
                  /* Hide buttons on the print layout */
                  .print-btn, .close-btn {
                    display: none;
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
    };


    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const url = new URL(
                    "https://hotelbarkat.com/Apis/Orders_Coupon_number_Fetch_Api.php"
                );

                const response = await fetch(url, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Get today's date
                const today = new Date();
                const todayFormatted = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD

                // Get yesterday's date
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                const yesterdayFormatted = yesterday.toISOString().split("T")[0]; // Format as YYYY-MM-DD

                // Get date 7 days ago from yesterday (excluding today)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(yesterday.getDate() - 7);

                // Filter today's coupons only
                const todaysCoupons = data.filter(
                    (coupon) => coupon.OaddedOn === todayFormatted
                );

                // Filter last 7 days' coupons excluding today
                const last7DaysCoupons = data.filter((coupon) => {
                    const couponDate = new Date(coupon.OaddedOn);
                    return couponDate >= sevenDaysAgo && couponDate < yesterday;
                });

                // Set state
                setCoupons({ todaysCoupons, last7DaysCoupons });
            } catch (error) {
                console.error("Error fetching coupon numbers:", error);
            }
        };

        fetchCoupons();
    }, []);





    // Fetch coupon details
    const fetchCouponDetails = async (couponNumber) => {
        setLoadingDetails(true);
        try {
            const url = `https://hotelbarkat.com/Apis/Order_Coupon_Dishes_Fetch_Api.php?CouponNum=${couponNumber}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            setSelectedCouponDetails(data);
            setIsModalOpen(true); // Open the modal
        } catch (error) {
            console.error("Error fetching coupon details:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Print functionality
    //   const handlePrint = () => {
    //     window.print();
    //   };

    return (
        <div>
            {/* Coupon Boxes */}
            <div style={{ backgroundColor: '#f9f9f9', width: '100vw' }}>
    {/* Today's Coupons Section */}
    <h2 style={{ paddingInline: '1rem', paddingTop: '1rem' }}>Today's Orders</h2>
    <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            padding: "20px",
            justifyContent: '',
            width: '100%',
        }}
    >
        {coupons.todaysCoupons.length > 0 ? (
            coupons.todaysCoupons.map((coupon, index) => (
                <div
                    key={index}
                    onClick={() => fetchCouponDetails(coupon.O_CouponNo)}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "25px",
                        flex: '1 1 calc(20% - 16px)', // Adjusts the size dynamically
                        textAlign: "center",
                        color: '#fff',
                        backgroundColor: "#435e78",
                        cursor: "pointer",
                        maxWidth: '19%', // Ensures consistent sizing
                    }}
                >
                    <h3>{coupon.O_CouponNo || "N/A"}</h3>
                </div>
            ))
        ) : (
            <p>No coupons available for today.</p>
        )}
    </div>

    {/* Last 7 Days' Coupons Section */}
    <h2 style={{ paddingInline: '1rem', paddingTop: '1rem' }}>Last 7 Days Orders</h2>
    <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: 'start',
            gap: "16px",
            padding: "20px",
            width: '100%',
        }}
    >
        {coupons.last7DaysCoupons.length > 0 ? (
            coupons.last7DaysCoupons.map((coupon, index) => (
                <div
                    key={index}
                    onClick={() => fetchCouponDetails(coupon.O_CouponNo)}
                    style={{
                        border: "none",
                        borderRadius: "8px",
                        padding: "25px",
                        flex: '1 1 calc(20% - 16px)', // Adjusts the size dynamically
                        textAlign: "center",
                        color: '#fff',
                        backgroundColor: "#435e78",
                        maxWidth: '19%', // Ensures consistent sizing
                        cursor: "pointer",
                    }}
                >
                    <h3>{coupon.O_CouponNo || "N/A"}</h3>
                </div>
            ))
        ) : (
            <p>No coupons available for the last 7 days.</p>
        )}
    </div>
</div>



            {/* Modal for Coupon Details */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    className={style.modall}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            padding: "20px",
                            maxWidth: "500px",
                            width: "100%",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                        ref={receiptRef}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: "20px", color: "#333" }}>
                                Coupon Details
                            </h3>

                            <button
                                className={style.printbtn}
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    marginBottom: "10px",
                                    padding: "4px 8px",
                                    backgroundColor: "#f44336",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                X
                            </button>
                        </div>
                        {loadingDetails ? (
                            <p style={{ fontSize: "16px", color: "#555" }}>Loading details...</p>
                        ) : (
                            <div>
                                {selectedCouponDetails?.length > 0 && (
                                    <div>
                                        {/* Date and Time at the Top */}
                                        <div
                                            style={{
                                                fontSize: "14px",
                                                color: "#666",
                                                marginBottom: "16px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                            className={style.top}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                <span>{`Date: ${selectedCouponDetails[0]?.OaddedOn || "N/A"}`}</span>
                                                <span>{`Time: ${selectedCouponDetails[0]?.OAddedTime || "N/A"}`}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                <span>{`Coupon No: ${selectedCouponDetails[0]?.O_CouponNo || "N/A"}`}</span>
                                                <span>{`Table No: ${selectedCouponDetails[0]?.tableno || "N/A"}`}</span>
                                            </div>
                                        </div>

                                        {/* Header Row */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "8px 0",
                                                backgroundColor: "#f5f5f5",
                                                fontWeight: "bold",
                                                borderBottom: "2px solid #ddd",
                                            }}
                                        >
                                            <div style={{ flex: "2", textAlign: "start" }}>Dish Name</div>
                                            <div style={{ flex: "1", textAlign: "center" }}>Quantity</div>
                                            <div style={{ flex: "1", textAlign: "center" }}>Dish Rate</div>
                                            <div style={{ flex: "1", textAlign: "center" }}>Subtotal</div>
                                        </div>

                                        {/* Details Rows */}
                                        {selectedCouponDetails.map((dish, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "8px 0",
                                                    borderBottom: "1px solid #ddd",
                                                }}
                                            >
                                                <div style={{ flex: "2", textAlign: "start" }}>{dish.dish_name || "N/A"}</div>
                                                <div style={{ flex: "1", textAlign: "center" }}>{dish.order_unit || "N/A"}</div>
                                                <div style={{ flex: "1", textAlign: "center" }}>₹{dish.dist_rate || "N/A"}</div>
                                                <div style={{ flex: "1", textAlign: "center" }}>₹{dish.order_subtotal || "N/A"}</div>
                                            </div>
                                        ))}

                                        {/* Total Row */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "5px 0",
                                                // borderTop: "2px solid #ddd",
                                                // fontWeight: "bold",
                                                marginRight: "1.5rem",
                                                gap: "10px",
                                                // backgroundColor: "#f9f9f9",
                                            }}
                                        >
                                            <div>

                                                <span>Payment:</span>
                                                <span style={{ fontWeight: 'bold' }}> {selectedCouponDetails.reduce(
                                                    (total, dish) => '' + dish.pay_method.charAt(0).toUpperCase() + dish.pay_method.slice(1),
                                                    0
                                                )}</span>
                                            </div>
                                            <div>

                                                <span >Total:</span>
                                                <span style={{ fontWeight: 'bold' }}>
                                                    ₹
                                                    {selectedCouponDetails.reduce(
                                                        (total, dish) => total + parseFloat(dish.order_subtotal || 0),
                                                        0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        <div className={style.printbtn} style={{ marginTop: "20px", textAlign: "right" }}>
                            <button
                                onClick={handlePrint}
                                style={{
                                    padding: "8px 16px",
                                    marginRight: "8px",
                                    backgroundColor: "#4caf50",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}

                            // disabled={hasPrinted}
                            >
                                Print
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
