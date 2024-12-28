'use client'

import { ArrowDown, Link2, Loader2, Youtube, FileText, Globe } from 'lucide-react'
import { useDropzone } from "react-dropzone"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { UploadToVercelStorage } from "@/lib/BlobStorage"
import { useState } from "react"

export default function FileUpload() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [activeTab, setActiveTab] = useState("upload")

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large")
        return
      }

      try {
        setUploading(true)
        const { data, success } = await UploadToVercelStorage(file)
        const response = await fetch("/api/create-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_key: data.file_key,
            file_name: data.file_name,
            url: data.url,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create chat")
        }

        const { chatId } = await response.json()
        toast.success("Chat created!")
        router.push(`/chat/${chatId}`)
      } catch (error) {
        console.error(error)
        toast.error("Error creating chat")
      } finally {
        setUploading(false)
      }
    },
  })

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    try {
      setUploading(true)
      const response = await fetch("/api/create-chat-from-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error("Failed to create chat from URL")

      const { chatId } = await response.json()
      toast.success("Chat created from URL!")
      router.push(`/chat/${chatId}`)
    } catch (error) {
      console.error(error)
      toast.error("Error creating chat from URL")
    } finally {
      setUploading(false)
    }
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text) return

    try {
      setUploading(true)
      const response = await fetch("/api/create-chat-from-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error("Failed to create chat from text")

      const { chatId } = await response.json()
      toast.success("Chat created from text!")
      router.push(`/chat/${chatId}`)
    } catch (error) {
      console.error(error)
      toast.error("Error creating chat from text")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">


      <div className="mb-8">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 font-medium rounded-lg ${
              activeTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Upload Sources
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-4 py-2 font-medium rounded-lg ${
              activeTab === "paste" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Paste Content
          </button>
        </div>
      </div>

      {activeTab === "upload" && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg">
            <div
              {...getRootProps({
                className:
                  "flex flex-col items-center justify-center py-20 px-4 text-center cursor-pointer",
              })}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <>
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-lg font-medium">Processing your document...</p>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <ArrowDown className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-lg font-medium mb-2">Drop PDF Here</p>
                  <p className="text-sm text-gray-500">
                    Supported file types: PDF (up to 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Website URL</h3>
                </div>
                <div className="space-y-2">
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">Enter website URL</label>
                  <input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading || !url}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Create Chat"
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Youtube className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">YouTube</h3>
              </div>
              <div className="space-y-2">
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">Enter YouTube URL</label>
                <input
                  id="youtube"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "paste" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Paste Text</h3>
            </div>
            <div className="space-y-2">
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">Enter or paste text</label>
              <textarea
                id="text"
                className="w-full min-h-[200px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !text}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Create Chat"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

