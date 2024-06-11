import { list } from '@vercel/blob';
import { NextRequest, NextResponse } from "next/server";

 export const runtime = "nodejs";
 
export async function GET(request: NextRequest) {
  const { blobs } = await list();
 
  return NextResponse.json(blobs);
}