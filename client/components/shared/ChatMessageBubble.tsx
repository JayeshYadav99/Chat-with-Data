import { useState } from "react";
import type { Message } from "ai/react";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
export function ChatMessageBubble(props: {
  message: Message;
  aiEmoji?: string;
  sources: any[];
  isLoading?: boolean;
}) {
  // console.log(props);
  const { isLoading } = props;
  const role = props.message.role;
  // console.log(role);
  const [showSources, setShowSources] = useState(false);

  const colorClassName =
    props.message.role === "user" ? "bg-sky-600" : "bg-slate-100 text-black";
  const alignmentClassName =
    props.message.role === "user" ? "ml-auto" : "mr-auto";
  const prefix = props.message.role === "user" ? "🧑" : props.aiEmoji;

  return (
    <motion.div
      className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex">
        <div className="mr-2">{prefix}</div>
        <div className="whitespace-pre-wrap flex flex-col">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          ) : (
            <span>
              <Markdown>{props.message.content}</Markdown>
            </span>
          )}
        </div>
      </div>

      {props.sources && props.sources.length > 0 && (
        <div className="mt-2">
          <button
            className="bg-gray-200 text-black px-2 py-1 rounded mt-2 text-sm"
            onClick={() => setShowSources(!showSources)}
          >
            {showSources ? "Hide Sources" : "View Sources"}
          </button>
          <AnimatePresence>
            {showSources && (
              <motion.div
                className="mt-2 bg-slate-600 text-white p-2 rounded text-xs"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-bold">🔍 Sources:</h2>
                {props.sources.map((source, i) => (
                  <div className="mt-2" key={"source:" + i}>
                    {i + 1}. &quot;{source.pageContent}&quot;
                    {source.metadata?.loc?.lines !== undefined && (
                      <div>
                        <br />
                        Lines {source.metadata?.loc?.lines?.from} to{" "}
                        {source.metadata?.loc?.lines?.to}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
