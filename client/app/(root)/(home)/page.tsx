import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar/Navbar'
import FileUpload from '@/components/shared/upload/FileUpload'
import HybridUpload from '@/components/shared/upload/HybridUpload'
import { auth } from '@clerk/nextjs/server'
import { getFirstChatByUserId } from '@/lib/actions/chat.action'

import { Upload, MessageSquare, Search, FileUp, Share2, GitFork } from 'lucide-react'

export default async function Page() {
  const { userId } = await auth()
  const isAuth = !!userId
  let firstChatId

  if (userId) {
    const { success, data } = await getFirstChatByUserId({ userId }) as { success: boolean; data: null | any[] }
    if (success) {
      firstChatId = data
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-grow bg-gray-100">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Effortlessly Chat with Your Documents</h1>
          <p className="mt-4 text-gray-700">Get instant answers, summaries, and insights from your documents through a conversational interface.</p>
          <div className="mt-6 space-x-4">
      
            {isAuth && firstChatId && (
              <Link href={`/chat/${firstChatId}`} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300">Go to Chat</Link>
            )}
          </div>
        </div>
      </section>    
      <section>
        {/* <div className="w-full mt-4">
          {isAuth && <FileUpload />}
        </div> */}
        <div className="w-full mt-4">
          {isAuth && <HybridUpload />}
        </div>
  
      </section>
      <section className="bg-white" id="features">
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Upload className="mx-auto h-16 w-16 text-blue-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">Upload and Manage Documents</h3>
              <p className="mt-2 text-gray-700">Seamlessly upload and organize your documents in various formats.</p>
            </div>
            <div className="text-center">
              <MessageSquare className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">Interactive Chat Interface</h3>
              <p className="mt-2 text-gray-700">Ask questions and get real-time answers from your documents.</p>
            </div>
            <div className="text-center">
              <Search className="mx-auto h-16 w-16 text-purple-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">Advanced Search and Summarization</h3>
              <p className="mt-2 text-gray-700">Easily find and summarize key information from your documents.</p>
            </div>
            <div className="text-center">
              <FileUp className="mx-auto h-16 w-16 text-orange-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">Export Chat</h3>
              <p className="mt-2 text-gray-700">Export your chat conversations in various formats for easy sharing and reference.</p>
            </div>
            <div className="text-center">
              <Share2 className="mx-auto h-16 w-16 text-pink-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">Share Chats</h3>
              <p className="mt-2 text-gray-700">Share your chat sessions with colleagues or friends for collaborative insights.</p>
            </div>
            <div className="text-center">
              <GitFork className="mx-auto h-16 w-16 text-indigo-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">Fork Chats</h3>
              <p className="mt-2 text-gray-700">Create new chat branches from existing conversations for exploring different topics.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}