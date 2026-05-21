"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ConversationMessage } from "@/types/artifact";

interface AskAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperTitle?: string;
  paperId?: string;
}

// Mock responses for demonstration
const mockResponses: Record<string, string> = {
  default:
    "Based on my analysis of this paper, I can provide insights on the methodology, key findings, and potential applications. The hierarchical ensemble TinyML approach shows particularly promising results for edge-based agricultural monitoring systems.",
  methodology:
    "The paper employs a two-layered TinyML architecture where individual sensor nodes run lightweight ML models, and edge aggregators perform ensemble fusion. The authors validate this through a real smart-agriculture deployment, measuring transmission reduction, latency, and energy consumption metrics.",
  findings:
    "Key findings include: 73% reduction in wireless transmissions, 41% decrease in energy consumption, and 68% improvement in response latency compared to cloud-only processing. The system maintained 94% decision accuracy across the hierarchical ensemble.",
  experiments:
    "The authors propose three experiment directions: (1) Deploying the hierarchical ensemble on ESP32 sensor networks, (2) Benchmarking edge vs cloud inference for crop disease detection, and (3) Simulating the decision fusion in NS-3 network simulator.",
  applications:
    "Practical applications include precision irrigation systems, crop health monitoring, autonomous pest detection, and livestock security systems. The edge-first approach is particularly valuable in areas with limited connectivity or where real-time responses are critical.",
};

const suggestedQuestions = [
  "What methodology does this paper use?",
  "What are the key findings?",
  "What experiments does it propose?",
  "What are practical applications?",
];

function generateMockResponse(question: string): string {
  const lowerQ = question.toLowerCase();
  if (lowerQ.includes("methodolog")) return mockResponses.methodology;
  if (lowerQ.includes("finding") || lowerQ.includes("result")) return mockResponses.findings;
  if (lowerQ.includes("experiment") || lowerQ.includes("propos")) return mockResponses.experiments;
  if (lowerQ.includes("applic") || lowerQ.includes("practical") || lowerQ.includes("use case")) return mockResponses.applications;
  return mockResponses.default;
}

export function AskAgentModal({
  isOpen,
  onClose,
  paperTitle = "Untitled Paper",
}: AskAgentModalProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `I'm ready to help you explore "${paperTitle}". I can discuss the methodology, findings, experiments, and practical applications. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const response = generateMockResponse(userMessage.content);
    const assistantMessage: ConversationMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Agent avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  />
                </svg>
              </div>
              <div>
                <DialogTitle className="text-base font-medium">
                  Research Assistant
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Ask questions about this paper
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 min-h-0">
          <div className="p-5 space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "justify-end"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-primary flex-shrink-0 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 00-3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-[85%] leading-relaxed text-sm",
                    message.role === "assistant"
                      ? "bg-muted/60 text-foreground border border-border/50"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-primary flex-shrink-0 flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 00-3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
                <div className="bg-muted/60 border border-border/50 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Suggested questions when empty */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Try asking about:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card hover:bg-accent hover:border-primary/30 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border/50 bg-card/50">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about this paper..."
              className="min-h-[44px] max-h-[120px] resize-none bg-background"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-auto px-4 bg-primary hover:bg-primary/90"
              size="icon"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
            Responses are for demonstration. Connect to your AI backend for real
            answers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AskAgentModal;