import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/navbar/Navbar'

export default function page() {
  return (

    <div className="min-h-screen flex flex-col">
         <Navbar />
      <section className="flex-grow bg-gray-100">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Effortlessly Chat with Your Documents</h1>
          <p className="mt-4 text-gray-700">Get instant answers, summaries, and insights from your documents through a conversational interface.</p>
          <div className="mt-6 space-x-4">
            <Link href={'/upload'} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Get Started</Link>
            <Link href={'/chat'}className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300">Go to Chats</Link>
          </div>
        </div>
      </section>    

      <section className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Image src="/assets/icons/upload.png" alt="Upload" width={100} height={100} className="mx-auto h-16 w-16"/>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Upload and Manage Documents</h3>
              <p className="mt-2 text-gray-700">Seamlessly upload and organize your documents in various formats.</p>
            </div>
            <div className="text-center">
              <Image src="/assets/icons/chat.png" alt="Chat"  width={100 } height={100} className="mx-auto h-16 w-16"/>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Interactive Chat Interface</h3>
              <p className="mt-2 text-gray-700">Ask questions and get real-time answers from your documents.</p>
            </div>
            <div className="text-center">
              <Image src="/assets/icons/search.png" alt="Search" width={100 } height={100}  className="mx-auto h-16 w-16"/>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Advanced Search and Summarization</h3>
              <p className="mt-2 text-gray-700">Easily find and summarize key information from your documents.</p>
            </div>

          </div>
        </div>
      </section>

        </div>
  )
}
