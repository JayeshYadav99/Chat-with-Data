import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ChatMessage {
  role: string;
  content: string;
}

export const generatePDF = (chatMessages: ChatMessage[]) => {
  const doc = new jsPDF();

  // Add a title
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80); // Dark blue color
  doc.setFont("helvetica", "bold");
  doc.text("Chat with Docs - Conversation Export", 14, 22);

  // Add a subtitle
  doc.setFontSize(14);
  doc.setTextColor(52, 73, 94); // Slightly lighter blue
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

  // Add conversation summary
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const totalMessages = chatMessages.length;
  const userMessages = chatMessages.filter(
    (msg) => msg.role.toLowerCase() === "user",
  ).length;
  const aiMessages = totalMessages - userMessages;
  doc.text(`This conversation contains ${totalMessages} messages:`, 14, 45);
  doc.text(`• ${userMessages} from the user`, 20, 52);
  doc.text(`• ${aiMessages} from the AI assistant`, 20, 59);

  // Prepare chat data for table in a single-column Q&A format
  const rows = chatMessages.map((message, index) => {
    const prefix = message.role.toLowerCase() === "user" ? "Q: " : "A: ";
    return [
      {
        content: `${prefix}${message.content}`,
        styles: {
          fillColor:
            index % 2 === 0
              ? ([241, 246, 250] as [number, number, number])
              : ([255, 255, 255] as [number, number, number]),
        },
      },
    ];
  });

  // Generate a table using jsPDF's autoTable plugin with custom styling
  autoTable(doc, {
    body: rows,
    startY: 70,
    styles: {
      fontSize: 10,
      cellPadding: 8,
      overflow: "linebreak",
      cellWidth: "wrap",
      valign: "top",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
    },
    bodyStyles: {
      lineColor: [189, 195, 199],
      lineWidth: 0.25,
    },
    margin: { top: 10, right: 15, bottom: 15, left: 15 },
    didParseCell: (data) => {
      if (data.section === "body") {
        const content = data.cell.raw as { content: string };
        if (content.content.startsWith("Q:")) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.textColor = [41, 128, 185]; // Blue for questions
        } else {
          data.cell.styles.textColor = [44, 62, 80]; // Dark gray for answers
        }
      }
    },
  });

  // Add a footer
  //@ts-ignore
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10,
    );
  }

  // Save the generated PDF
  doc.save("chat_export.pdf");
};
