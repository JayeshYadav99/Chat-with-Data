import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export async function downloadFromURL(file_url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(file_url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      const buffer = await response.buffer();

      // Create a temporary file path
    //   const filePath = path.join(process.cwd(), "public/assets", filename);
      const tempFilePath = path.join(process.cwd(),"public/assets", `file_${Date.now().toString()}.pdf`);

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
