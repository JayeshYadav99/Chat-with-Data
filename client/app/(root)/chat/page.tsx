
import React from 'react'


import PdfViewer from '@/components/shared/PDFViewer'

import ChatWindow from '@/components/shared/Chatwindow'
import ChatSidebar from '@/components/shared/ChatSidebar'

const page = (
  {
   
  }
) => {




  return (
    <div>


      <div className="flex h-screen ">
        <ChatSidebar   />
    
        <main className="w-3/4 flex">
        <div className="w-1/2 border-black border-4 p-6">
           

           <section className='  h-screen overflow-hidden'>
           <header className="flex justify-between items-center ">
             <h1 className="text-2xl text-black font-bold">PDF Preview</h1>
           </header>
         
           <div className="flex justify-center items-center w-full h-full">
          <PdfViewer previewUrl={"https://xf6s4f8pcrct3qte.public.blob.vercel-storage.com/Jayesh%20Yadav%20(6)-QIwPySHoe3nUB0Atfe03QS6UUmitPi.pdf"} />
        </div>

           </section>
         
         </div>
          <div className="w-1/2   border-black border-4  p-6 h-screen overflow-hidden">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-black font-bold">Chat</h1>

            </header>
          
            <ChatWindow
  
      endpoint="api/chat/retrieval"
      
      // showIngestForm={true}
      placeholder={
        'Ask me anything about the document'
      }
      emoji="🐶"
      titleText="Flawless Introvert"
    ></ChatWindow>
          
          
        

          </div>
        </main>
      </div>
    </div>
  );
}

export default page