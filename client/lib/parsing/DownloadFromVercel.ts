import { Readable } from "stream";

import fs from "fs";
import path from "path";
// MIME type to file extension map
const mimeToExtensionMap: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/csv": ".csv",
  "text/plain": ".txt", // Default to .txt for plain text files
  "application/epub+zip": ".epub",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".pptx",
};
// Function to determine file extension from MIME type
function getFileExtension(mimeType: string): string {
  return mimeToExtensionMap[mimeType] || ".bin"; // Default to .bin for unknown types
}


export async function downloadFromURL(
  file_url: string,
  file_type: string,
  client: any
): Promise<string> {
  console.log("Downloading from path:", file_url);
  const fileExtension = getFileExtension(file_type);

  const { data: downloadedFile, error } = await client
    .storage
    .from("file-documents")
    .download(file_url);

  if (error) {
    console.error("Error downloading file:", error);
    throw new Error("Failed to download file");
  }

  if (!downloadedFile) {
    throw new Error("No file data received");
  }

  console.log("download data:", downloadedFile);

  return new Promise((resolve, reject) => {
    var tempFilePath: string;
    // Set the path based on the environment
    if (process.env.NODE_ENV === 'development') {
      tempFilePath = path.join(
        process.cwd(),
        "public/assets",
        `file_${Date.now().toString()}${fileExtension}`
      );
    } else {
      tempFilePath = path.join(
        "/tmp",
        `file_${Date.now().toString()}${fileExtension}`
      );
    }


    const fileStream = fs.createWriteStream(tempFilePath);

    // For Node.js, convert the Blob to a stream and pipe
    const stream = Readable.from(downloadedFile.stream());

    stream.pipe(fileStream);
    stream.on("error", (err) => {
      console.error("Stream error:", err);
      reject(err);
    });

    fileStream.on("finish", () => {
      resolve(tempFilePath);
    });

    fileStream.on("error", (err) => {
      console.error("Error writing file:", err);
      reject(err);
    });
  });
}
