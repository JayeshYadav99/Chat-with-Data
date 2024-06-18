import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log(file);
    // // Read the file content to calculate the hash
    // const fileBuffer = await file.arrayBuffer();
    // const hash = crypto.createHash('sha256').update(new Uint8Array(fileBuffer)).digest('hex');
    // const fileKey = `uploads/${hash}-${file.name.replace(/ /g, '-')}`;

    // // Check if the file already exists in the storage
    // const existingFiles = await list('uploads/', { prefix: fileKey });

    // if (existingFiles.items.length > 0) {
    //   return NextResponse.json({
    //     success: true,
    //     data: {
    //       url: existingFiles.items[0].url,
    //       fileKey,
    //       fileName: file.name,
    //     },
    //   }, { status: 200 });
    // }

    // Upload the file if it's not a duplicate
    // const blob = await put(fileKey, Buffer.from(fileBuffer), {
    //   access: 'public',
    //   token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
    // });

    return NextResponse.json({
      success: true,
      data: {
        // url: blob.url,
        // fileKey,
        // fileName: file.name,
      },
    }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
