
import React from 'react';
interface Props {
    previewUrl: string;
    }

function PdfPreviewUpload({ previewUrl }:Props) {

  return (
    <div>
      {previewUrl && (
         <div  >
         {previewUrl && (
           <iframe
             src={previewUrl}
       
             width="400"
             height="600"
           ></iframe>
         )}
       </div>
      )}
    </div>
  );
}

export default PdfPreviewUpload;
