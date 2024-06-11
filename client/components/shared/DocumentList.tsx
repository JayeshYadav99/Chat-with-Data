import React from 'react'

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {useState, useEffect} from 'react';

interface Document {
  downloadUrl: string;
  pathname: string;
  size: number;
 uploadedAt:Date;
 url:string;

}
export default function DocumentList() {

  const [documents, setDocuments] =useState<Document[]>([]);

const fetchDocuments = async () => {
  const response = await fetch("/api/retrieval/documents/", {
    
    method: "GET"
  
  });
  const json = await response.json();
  console.log(json);
setDocuments(json);
}
useEffect(() => {
  fetchDocuments();
}, []);




  const selectedBlob = "Jayesh Yadav (6).pdf";
 
  return (
    <div className='bg-red-500'>
   
    {documents && documents.map((blob,index) => (
      <Link   className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
        "bg-blue-600 text-white": index === 0,
      })}
       key={blob?.downloadUrl} href={blob?.downloadUrl}>
        {blob?.pathname}
      </Link>
    ))}
  </div>
  )
}
