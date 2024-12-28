import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
// MIME type to file extension map
const mimeToExtensionMap: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/csv': '.csv',
  'text/plain': '.txt', // Default to .txt for plain text files
};
// Function to determine file extension from MIME type
function getFileExtension(mimeType: string): string {
  return mimeToExtensionMap[mimeType] || '.bin'; // Default to .bin for unknown types
}
export async function downloadFromURL(file_url: string,file_type:string): Promise<string> {
  console.log("downloading Docs into file system",file_url,file_type);
  const fileExtension = getFileExtension(file_type);
  const modifiedType = file_type.split('/')[1] != 'plain' ? file_type.split('/')[1] : 'txt';
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(file_url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      const buffer = await response.buffer();

      // Create a temporary file path
    //   const filePath = path.join(process.cwd(), "public/assets", filename);
      // const tempFilePath = path.join('/tmp', `file_${Date.now().toString()}.pdf`);
      const tempFilePath = path.join(process.cwd(), "public/assets", `file_${Date.now().toString()}${fileExtension}`);
      

      // Write the buffer to a file
      fs.writeFile(tempFilePath, buffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return reject(err);
        }
        resolve(tempFilePath);
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      reject(error);
    }
  });
}
