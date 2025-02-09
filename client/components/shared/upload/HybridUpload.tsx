"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowDown,
  FileText,
  Link,
  Loader2,
  Mic,
  Database,
  ImageIcon,
  Youtube,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileIcon,
  Globe,
  Github,
  FileCode,
  BookOpen,
  Presentation,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UploadToVercelStorage } from "@/lib/BlobStorage";

type UploadSection =
  | "document"
  | "url"
  | "image"
  | "audio"
  | "youtube"
  | "text";

interface ChipProps {
  section: UploadSection;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({
  section,
  icon: Icon,
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }`}
  >
    <Icon className="w-4 h-4 mr-1" />
    {label}
  </button>
);

export default function DiverseFileUploadWithChips() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [text, setText] = useState("");
  const [activeSection, setActiveSection] = useState<UploadSection>("document");

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large (max 50MB)");
      return;
    }

    await uploadFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
      "text/plain": [".txt"], // Added support for .txt files
      "application/epub+zip": [".epub"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
    maxFiles: 1,
  });

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const { data, success } = await UploadToVercelStorage(file);
      const response = await fetch("/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_key: data.file_key,
          file_name: data.file_name,
          url: data.url,
          file_type: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const { chatId } = await response.json();
      toast.success("Chat created!");
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error(error);
      toast.error("Error creating chat");
    } finally {
      setUploading(false);
    }
  };

  const isValidGithubUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.hostname === "github.com" &&
        parsedUrl.pathname.split("/").length >= 3
      );
    } catch {
      return false;
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setUploading(true);
      if (isValidGithubUrl(url)) {
        const response = await fetch("/api/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok)
          throw new Error("Failed to create chat from GitHub repository");

        const { chatId } = await response.json();
        toast.success("Chat created from GitHub repository!");
        router.push(`/chat/${chatId}`);
      } else {
        // Handle regular URL
        const response = await fetch("/api/docs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) throw new Error("Failed to create chat from URL");

        const { chatId } = await response.json();
        toast.success("Chat created from URL!");
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating chat from URL");
    } finally {
      setUploading(false);
    }
  };

  const renderUrlSection = () => (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <form onSubmit={handleUrlSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Website URL</h2>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter a website URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {isValidGithubUrl(url) ? (
                      <Github className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Globe className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="url"
                    name="url"
                    id="url"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder=" https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Supports GitHub repositories and public websites</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Make sure the repository or website is publicly accessible</span>
                </div> */}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !url}
              className={`w-full h-12 text-base flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                uploading || !url ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  {`Create Chat from ${isValidGithubUrl(url) ? "GitHub Repository" : "Website"}`}
                </>
              )}
            </button>
          </form>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <Github className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">GitHub Repository</h3>
                <p className="text-sm text-gray-600">Import code and documentation</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Website URL</h3>
                <p className="text-sm text-gray-600">Import content from any website</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
  const renderDocumentSection = () => (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-500 animate-pulse" />
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
          <p className="text-lg font-medium text-blue-600">
            Running RAG Ingestion workflow...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <FilePdf className="h-10 w-10 text-red-500" />
            <FileText className="h-10 w-10 text-blue-500" />
            <FileSpreadsheet className="h-10 w-10 text-green-500" />
            <FileCode className="h-10 w-10 text-yellow-500" />
            <BookOpen className="h-10 w-10 text-purple-500" />{" "}
            {/* Add EPUB icon */}
            <Presentation className="h-10 w-10 text-orange-500" />{" "}
            {/* Add PPT icon */}
          </div>
          <div>
            <p className="text-lg font-medium mb-2">Drop your document here</p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOCX, XLSX, CSV, TXT ,EPUB ,PPTX
            </p>
            <p className="text-xs text-gray-400 mt-1">Max file size: 50MB</p>
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
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Upload Your Data in more than 9 file formats
      </h1>

      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <Chip
          section="document"
          icon={FileText}
          label="Document"
          isActive={activeSection === "document"}
          onClick={() => setActiveSection("document")}
        />
        <Chip
          section="url"
          icon={Link}
          label="URL"
          isActive={activeSection === "url"}
          onClick={() => setActiveSection("url")}
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
        {/* <Chip
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
        /> */}
      </div>

      <div className="bg-gradient-to-b from-white to-gray-100 p-8 rounded-xl shadow-lg border border-gray-200">
        {activeSection === "url" && renderUrlSection()}
        {activeSection === "document" && renderDocumentSection()}
        {/* Other sections remain unchanged */}
      </div>
    </div>
  );
}
