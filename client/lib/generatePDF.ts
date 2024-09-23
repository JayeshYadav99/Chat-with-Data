import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (chatMessages:any) => {
  const doc = new jsPDF();

  // Add a title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Chat Export', 14, 22);
  doc.setFont('helvetica', 'normal');
  
  // Add some space before the table
  doc.setFontSize(12);
  doc.text('Below are the chat messages:', 14, 30);

  // Prepare chat data for table (Q&A format)
  const rows = chatMessages.map((message:any) => [
    message.role,
    message.content,
  ]);

  // Set column widths
  const columnWidths = [30, 150]; // Adjust widths as needed

  // Generate a table using jsPDF's autoTable plugin with custom styling
  autoTable(doc, {
    head: [['Speaker', 'Message']],
    body: rows,
    startY: 40,
    styles: {
      fillColor: [220, 220, 220],
      fontSize: 12,
      cellPadding: 5,
      minCellHeight: 10,
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontSize: 14,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: columnWidths[0] },
      1: { cellWidth: columnWidths[1] },
    },
    margin: { top: 10 },
  });

  // Add a footer
  doc.setFontSize(10);
  doc.text('Generated on: ' + new Date().toLocaleString(), 14, doc.internal.pageSize.getHeight() - 10);

  // Save the generated PDF
  doc.save('chat_export.pdf');
};
