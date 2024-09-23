import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";

interface SharedChatReplicationProps {
  originalChat: any;
}

export default function SharedChatReplication({ originalChat }: SharedChatReplicationProps) {
  const [isReplicating, setIsReplicating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const replicateSharedChat = async () => {
    setIsReplicating(true);
    try {
        
      const response = await fetch('/api/replicate-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalChat }),
      });

      if (!response.ok) {
        throw new Error('Failed to replicate chat');
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Chat Replicated Successfully",
          description: "You can now start chatting with the replicated PDF.",
        });
        router.push(`/chat/${data.newChatId}`);
      } else {
        throw new Error(data.message || 'Failed to replicate chat');
      }
    } catch (error) {
      console.error('Error replicating chat:', error);
      toast({
        title: "Failed to replicate chat",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsReplicating(false);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <Button
        onClick={replicateSharedChat}
        disabled={isReplicating}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
      >
        {isReplicating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Replicating...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Chat with this shared PDF
          </>
        )}
      </Button>
    </div>
  );
}