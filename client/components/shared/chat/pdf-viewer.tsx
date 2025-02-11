import React from "react";
import { Loader2 } from "lucide-react";

interface Props {
  previewUrl: string;
}

export default function PdfPreviewUpload({ previewUrl }: Props) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      {previewUrl ? (
        <iframe
          src={previewUrl}
          className="w-full h-full border-none"
          title="PDF Preview"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Loading PDF preview...</p>
        </div>
      )}
    </div>
  );
}
