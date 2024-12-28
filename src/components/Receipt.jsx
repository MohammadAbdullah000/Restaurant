import React from "react";
import jsPDF from "jspdf";

const Receipt = ({ dineOrParcel, addedItems,coupon }) => {
  const printReceipt = () => {
    // const coupon = Math.floor(Math.random() * 100);

    // Calculate total price
    const totalPrice = addedItems.reduce(
      (total, item) => total + item.dist_rate * item.quantity,
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

    // Calculate dynamic height
    const baseHeight = 40; // Starting height for fixed content
    const itemHeight = addedItems.length * 10; // 10mm per item for wrapped text
    const footerHeight = 20; // Footer height
    const totalHeight = baseHeight + itemHeight + footerHeight;

    // Create a new PDF with dynamic height
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [59, totalHeight], // 59mm width and dynamic height
    });

    // Add receipt content
    pdf.setFontSize(8); // Reduced from 10 to 8
    pdf.text("Receipt", 25, 10, { align: "center" }); // Centered title
    pdf.setFontSize(6); // Reduced from 8 to 6
    pdf.text(`Date: ${formattedDate}`, 5, 20);
    pdf.text(`Time: ${formattedTime}`, 40, 20);
    pdf.text(`Type: ${dineOrParcel}`, 5, 25);
    pdf.text(`Coupon Code: ${coupon}`, 5, 30);

    // Add order items
    
    pdf.setFontSize(6); // Reduced from 8 to 6
    let yPosition = 40; // Start position for items
    pdf.text("Item", 5, yPosition);
    pdf.text("Qty", 35, yPosition); // Moved QTY column 8px to the right
    pdf.text("Price", 40, yPosition);
    pdf.text("Amount", 50, yPosition);
    yPosition += 5;

    addedItems.forEach((item) => {
      const itemNameLines = pdf.splitTextToSize(item.dish_name, 25); // 45% of 59mm (approx. 25mm)
      const lineHeight = 5; // Height for each line
      const itemHeight = itemNameLines.length * lineHeight;

      itemNameLines.forEach((line, index) => {
        pdf.text(line, 5, yPosition + index * lineHeight); // Item name
      });

      // Add other columns only to the first line
      pdf.text(`${String(item.quantity)}`, 35, yPosition); // Moved QTY column 8px to the right
      pdf.text(`₹${String(item.dist_rate)}`, 40, yPosition);
      pdf.text(`₹${String(item.dist_rate * item.quantity)}`, 50, yPosition);

      yPosition += itemHeight + 2; // Move to the next item's position
    });

    // Add total price
    pdf.text(`Total: ₹${String(totalPrice)}`, 5, yPosition + 5);

    // Footer
    pdf.text("Presented by Barkat", 5, yPosition + 15);

    // Save the PDF
    pdf.save("receipt.pdf");
    
  };

  return (
    <div>
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
        onClick={printReceipt}
      >
        Print
      </button>
    </div>
  );
};

export default Receipt;
