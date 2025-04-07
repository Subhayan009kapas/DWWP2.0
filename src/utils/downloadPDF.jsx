import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

 export const  downloadPDF = async ( transaction )=> {
        console.log(transaction );

        if (!transaction) {
            alert('Invalid pdf download.');
            return;
        }
        const doc = new jsPDF();
        // Header section
        const logo = 'https://i.ibb.co/TDd24C9X/Domestic.png';
        doc.addImage(logo, 'PNG', 10, 10, 20, 20); // Add logo
        doc.setFontSize(18);
        doc.text("Domestic Water Wastage Prevention System", 40, 15);
        doc.setFontSize(12);
        doc.text("ONLINE BILL", 40, 25);
    
        // Bill Details Section
        doc.setFontSize(10);
        doc.text(`Bill Month: ${transaction.month}`, 10, 40);
        // doc.text(`Consumer Name: ${userDetails[0]} `, 120, 40);
        doc.text(`Bill ID: ${transaction.id}`, 10, 45);
        // doc.text(`Contact No: ${userDetails[1]}`, 120, 45);
        doc.text(`Bill Date: ${transaction.date}`, 10, 50);
        // doc.text(`Valid ID: ${userDetails[2]}`, 120, 50);
        doc.text(`Payment Status: ${transaction.status}`, 10, 55);
        // doc.text(`Consumer Address: ${userDetails[3]}`, 120, 55);
        doc.text(`Type: ${transaction.type}`, 10, 60);
    
        // Line separator
        doc.line(10, 60, 200, 60);
    
        // Reading Details Table
        doc.setFontSize(10);
        doc.text(`Payment Date: ${transaction.date}`, 10, 100);
        // doc.text("Reading", 60, 70);
        doc.text(`Consumption : ${344434}`, 160, 100);
        doc.line(10, 72, 200, 72); // Header underline
    
        // Additional Amount Details Table
        // doc.text("Additional Amount Details", 10, 100);
        doc.line(10, 102, 200, 102);
        doc.text("Particulars", 10, 110);
        doc.text("Amount", 160, 110);
        doc.line(10, 112, 200, 112);
    
        // Sample rows for additional charges
        let yPosition = 120;
        const charges = [
            { name: "Fare Price", amount: `${transaction.amount}` },
            { name: "Fine", amount: `${transaction.amount}` },
        ];
        charges.forEach(charge => {
            doc.text(charge.name, 10, yPosition);
            doc.text(charge.amount, 160, yPosition);
            yPosition += 10;
        });
    
        // Footer with Total
        doc.setFontSize(16);
        doc.text(`Total Amount: ${transaction.amount}`, 130, yPosition + 10 );
        doc.line(10, yPosition + 15, 200, yPosition + 15);
    
        // Authorized Signatory Section
        doc.setFontSize(10);
        doc.text("Authorized Signatory", 10, yPosition + 30);
        const ok = 'https://i.ibb.co/W67L2fK/pngwing-com.png';
        doc.addImage(ok, 'PNG', 50,yPosition + 25, 10, 10); 
    
        // Footer with Download Date
        const downloadDate = new Date().toLocaleDateString();
        doc.text(`Downloaded on: ${downloadDate}`, 150, yPosition + 30);
    
        // Save PDF
        doc.save(`DWWP _ ${transaction.month}.pdf`);
    }
    