"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Download } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { generatePDF } from "@/lib/generatePDF";
import { updateChatStatus } from "@/lib/actions/chat.action";

interface ShareChatModalProps {
  chatId: string;
  messages: { role: string; content: string }[];
}

export default function ShareChatModal({
  chatId,
  messages,
}: ShareChatModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/share/${chatId}`;

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await updateChatStatus({ chatId, isPublic: true });
      if (result.success) {
        setIsOpen(true);
        toast({
          title: "Chat shared successfully",
          description: "You can now copy the link to share with others.",
        });
      } else {
        throw new Error(result.message || "Failed to share chat");
      }
    } catch (error) {
      console.error("Failed to share chat:", error);
      toast({
        title: "Failed to share chat",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportChat = () => {
    try {
      generatePDF(messages);
      toast({
        title: "Chat exported",
        description: "Your chat has been exported as a PDF file.",
      });
    } catch (error) {
      console.error("Failed to export chat:", error);
      toast({
        title: "Failed to export chat",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleShare} disabled={isSharing}>
          <Share2 className="mr-2 h-4 w-4" />
          {isSharing ? "Sharing..." : "Share Chat"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Chat</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4">
          <div className="grid flex-1 gap-2">
            <Input
              id="share-link"
              defaultValue={shareUrl}
              readOnly
              className="w-full"
              aria-label="Share link"
            />
          </div>
          <Button
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
            variant={isCopied ? "secondary" : "default"}
            aria-label={isCopied ? "Copied" : "Copy link"}
          >
            {isCopied ? "Copied" : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex justify-center">
          <Button variant="outline" onClick={exportChat}>
            <Download className="mr-2 h-4 w-4 text-purple-500" />
            Export Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
