import { useRef } from "react";
const handlePrint = (receiptRef) => {
  const printContents = receiptRef.current.innerHTML;

  // Create a temporary printable area
  const tempPrintDiv = document.createElement("div");
  tempPrintDiv.innerHTML = `
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .receipt-container {
            width: 59mm;
            margin: 0 auto;
            padding: 5mm;
            font-size: 10px;
            line-height: 1.4;
            word-wrap: break-word;
          }
          h4 {
            text-align: center;
            margin: 5px 0;
          }
          p {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 9px;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          ${printContents}
        </div>
      </body>
    </html>
  `;

  document.body.appendChild(tempPrintDiv);

  // Trigger print and remove temporary div after
  window.print();
  document.body.removeChild(tempPrintDiv);
};

const ModalReceipt = ({ dineOrParcel, addedItems, coupon, payment }) => {
  const receiptRef = useRef();

  const totalPrice = addedItems.reduce(
    (total, item) => total + item.dist_rate * item.order_unit,
    0
  );

  const now = new Date();
  const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now
    .getFullYear()
    .toString()
    .slice(2)}`;
  const formattedTime = `${now.getHours()}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <div>
      {/* Printable content */}
      <div ref={receiptRef} style={{ display: "none" }}>
        <h4>Receipt</h4>
        <p>Date: {formattedDate}</p>
        <p>Time: {formattedTime}</p>
        <p>Type: {dineOrParcel}</p>
        <p>Coupon Code: {coupon}</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {addedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.dish_name}</td>
                <td>{item.order_unit}</td>
                <td>₹{item.dist_rate}</td>
                <td>₹{item.dist_rate * item.order_unit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>Total: ₹{totalPrice}</p>
        <p>Payment Mode: {payment}</p>
        <p className="footer">Presented by Barkat</p>
      </div>

      {/* Print button */}
      <button
        style={{
          backgroundColor: "#435e78",
          borderRadius: "5px",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "49%",
          fontWeight: "500",
          fontSize: "18px",
        }}
        onClick={() => handlePrint(receiptRef)}
      >
        Print
      </button>
    </div>
  );
};

export default ModalReceipt;
