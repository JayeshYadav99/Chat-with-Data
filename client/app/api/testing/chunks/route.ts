import { NextRequest, NextResponse } from 'next/server';
import getChunkedDocsFromPDF from '@/lib/parsing/Pdfloader';
import path from 'path';

export async function POST(req: NextRequest)
{
    try
    {
        const documentPath = path.join(process.cwd(), 'public/assets', 'resume.pdf');
        const res = await getChunkedDocsFromPDF(documentPath || "D:\\Next js\\Chat-with-Data\\client\\public\\assets\\file_1718355894566.pdf");

        
          return NextResponse.json({ success:true ,res}, { status: 200 },);
        
    }
    catch(error)
    {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }

}