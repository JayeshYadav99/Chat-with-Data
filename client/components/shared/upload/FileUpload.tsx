"use client";

import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UploadToVercelStorage } from "@/lib/BlobStorage";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);


  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.size > 10 * 1024 * 1024) {
          // bigger than 10mb!
          toast.error("File too large");
          return;
        }

        try
        {
            setUploading(true);
            console.log("Uploading file")
          
            const{data,success}=await      UploadToVercelStorage(file);
const response = await axios.post("/api/create-chat", {
                file_key: data.file_key,
                file_name: data.file_name,
                url:data.url
              });
             
      
              const {chatId}=response.data;
              toast.success("Chat created!");
             router.push(`/chat/${chatId}`);
       
        }
        catch (error)
        {
        toast.error("Error creating chat");
        console.error(error);
        }
        finally{
            setUploading(false);
        }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading  ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
             Playing with Google Generative AI
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;