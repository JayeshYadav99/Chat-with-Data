import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import HybridUpload from "@/components/shared/upload/HybridUpload";
import { auth } from "@clerk/nextjs/server";
import { getFirstChatByUserId } from "@/lib/actions/chat.action";
import { ChatResponse } from "@/types/chat";
import FeatureCard from "@/components/shared/home/feature-card";

import {
  Upload,
  MessageSquare,
  Search,
  FileUp,
  Share2,
  GitFork,
} from "lucide-react";

export default async function Page() {
  // Authenticate user and get first chat ID
  const { userId } = auth();
  const isAuth = !!userId;
  let firstChatId: string | undefined;

  if (userId) {
    const { success, data } = (await getFirstChatByUserId({
      userId,
    })) as ChatResponse;
    if (success && data) {
      firstChatId = data;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <Navbar />
      <section className="flex-grow bg-gray-100">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Effortlessly Chat with Your Documents
          </h1>
          <p className="mt-4 text-gray-700">
            Get instant answers, summaries, and insights from your documents
            through a conversational interface.
          </p>
          <div className="mt-6 space-x-4">
            {isAuth && firstChatId && (
              <Link
                href={`/chat/${firstChatId}`}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
              >
                Go to Chat
              </Link>
            )}
          </div>
        </div>
      </section>
      {/* Upload section */}
      <section>
        <div className="w-full mt-4">{isAuth && <HybridUpload />}</div>
      </section>
      {/* Features section */}
      <section className="bg-white" id="features">
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards */}
            <FeatureCard
              icon={<Upload className="mx-auto h-16 w-16 text-blue-500" />}
              title="Upload and Manage Documents"
              description="Seamlessly upload and organize your documents in various formats."
            />
            <FeatureCard
              icon={
                <MessageSquare className="mx-auto h-16 w-16 text-green-500" />
              }
              title="Interactive Chat Interface"
              description="Ask questions and get real-time answers from your documents."
            />
            <FeatureCard
              icon={<Search className="mx-auto h-16 w-16 text-purple-500" />}
              title="Advanced Search and Summarization"
              description="Easily find and summarize key information from your documents."
            />
            <FeatureCard
              icon={<FileUp className="mx-auto h-16 w-16 text-orange-500" />}
              title="Export Chat"
              description="Export your chat conversations in various formats for easy sharing and reference."
            />
            <FeatureCard
              icon={<Share2 className="mx-auto h-16 w-16 text-pink-500" />}
              title="Share Chats"
              description="Share your chat sessions with colleagues or friends for collaborative insights."
            />
            <FeatureCard
              icon={<GitFork className="mx-auto h-16 w-16 text-indigo-500" />}
              title="Fork Chats"
              description="Create new chat branches from existing conversations for exploring different topics."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
