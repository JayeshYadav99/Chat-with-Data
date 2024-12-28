'use client'

import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowDown, FileText, Link, Loader2, Mic, ImageIcon, Youtube, FileIcon as FilePdf, FileSpreadsheet, FileIcon, FileCode } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { UploadToVercelStorage } from '@/lib/BlobStorage'

type UploadSection = 'document' | 'url' | 'image' | 'audio' | 'youtube' | 'text'

interface ChipProps {
  section: UploadSection
  icon: React.ElementType
  label: string
  isActive: boolean
  onClick: () => void
}

const Chip: React.FC<ChipProps> = ({ section, icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }`}
  >
    <Icon className="w-4 h-4 mr-1" />
    {label}
  </button>
)

export default function DiverseFileUploadWithChips() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [text, setText] = useState('')
  const [activeSection, setActiveSection] = useState<UploadSection>('document')

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large (max 50MB)')
      return
    }

    await uploadFile(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'], // Added support for .txt files
    },
    maxFiles: 1,
  })

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)
      const { data, success } = await UploadToVercelStorage(file)
      const response = await fetch('/api/create-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_key: data.file_key,
          file_name: data.file_name,
          url: data.url,
          file_type: file.type,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create chat')
      }

      const { chatId } = await response.json()
      toast.success('Chat created!')
      router.push(`/chat/${chatId}`)
    } catch (error) {
      console.error(error)
      toast.error('Error creating chat')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    try {
      setUploading(true)
      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error('Failed to create chat from URL')

      const { chatId } = await response.json()
      toast.success('Chat created from URL!')
      router.push(`/chat/${chatId}`) 
    } catch (error) {
      console.error(error)
      toast.error('Error creating chat from URL')
    } finally {
      setUploading(false)
    }
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text) return

    try {
      setUploading(true)
      const response = await fetch('/api/create-chat-from-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error('Failed to create chat from text')

      const { chatId } = await response.json()
      toast.success('Chat created from text!')
      router.push(`/chat/${chatId}`)
    } catch (error) {
      console.error(error)
      toast.error('Error creating chat from text')
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image too large (max 10MB)')
      return
    }
    await uploadFile(file)
  }

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Audio file too large (max 50MB)')
      return
    }
    await uploadFile(file)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'document':
        return (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
                <>
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-lg font-medium">Processing your document...</p>
                </>
              ) : (
                <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <FilePdf className="h-10 w-10 text-red-500" />
                  <FileText className="h-10 w-10 text-blue-500" />
                  <FileSpreadsheet className="h-10 w-10 text-green-500" />
                  <FileCode className="h-10 w-10 text-yellow-500" />
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">Drop your document here</p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOCX, XLSX, CSV, TXT
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max file size: 50MB
                  </p>
                </div>
                <div className="pt-4">
                  <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700">
                    <ArrowDown className="h-5 w-5 mr-2" />
                    <span>Drop files here or click to browse</span>
                  </div>
                </div>
              </div>
              )}
            {/* <File className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Drag & drop a PDF, DOCX, XLSX, or CSV file here, or click to select
            </p> */}
          </div>
        )
      case 'url':
        return (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Website Docs URL
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  name="url"
                  id="url"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={uploading || !url}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Processing
                </>
              ) : (
                'Create Chat from URL'
              )}
            </button>
          </form>
        )
      case 'image':
        return (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 10MB)</p>
            </div>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        )
      case 'audio':
        return (
          <label
            htmlFor="audio-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Mic className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">MP3, WAV or M4A (MAX. 50MB)</p>
            </div>
            <input
              id="audio-upload"
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleAudioUpload}
            />
          </label>
        )
      case 'youtube':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700">
                YouTube URL
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Youtube className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  name="youtube-url"
                  id="youtube-url"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              disabled={true}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Create Chat from YouTube (Coming Soon)
            </button>
          </div>
        )
      case 'text':
        return (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div >
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                Enter or paste text
              </label>
              <textarea
                id="text"
                name="text"
                rows={4}
                className="shadow-sm mb-4 p-4 focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !text}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Processing
                </>
              ) : (
                'Create Chat from Text'
              )}
            </button>
          </form>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Your Content</h1>

      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <Chip
          section="document"
          icon={FileText}
          label="Document"
          isActive={activeSection === 'document'}
          onClick={() => setActiveSection('document')}
        />
        <Chip
          section="url"
          icon={Link}
          label="URL"
          isActive={activeSection === 'url'}
          onClick={() => setActiveSection('url')}
        />
        {/* <Chip
          section="image"
          icon={ImageIcon}
          label="Image"
          isActive={activeSection === 'image'}
          onClick={() => setActiveSection('image')}
        /> */}
        {/* <Chip
          section="audio"
          icon={Mic}
          label="Audio"
          isActive={activeSection === 'audio'}
          onClick={() => setActiveSection('audio')}
        /> */}
        <Chip
          section="youtube"
          icon={Youtube}
          label="YouTube"
          isActive={activeSection === 'youtube'}
          onClick={() => setActiveSection('youtube')}
        />
        <Chip
          section="text"
          icon={FileText}
          label="Text"
          isActive={activeSection === 'text'}
          onClick={() => setActiveSection('text')}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderActiveSection()}
      </div>
    </div>
  )
}

