
import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/lib/toast";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

const AiChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simple AI responses for project ideas
  const aiResponses = [
    "Have you considered breaking this project into smaller milestones?",
    "That sounds interesting! Consider starting with a simple prototype first.",
    "What specific skills are you hoping to learn from this project?",
    "Great idea! Make sure to research similar projects for inspiration.",
    "Don't forget to add this to your portfolio when you finish!",
    "Have you thought about what technologies you'll use for this?",
    "Remember to scope your project realistically for your timeline.",
    "Would you like some resources on how to get started with this?",
    "That's ambitious! Consider finding a coding partner for this project.",
    "Make sure to document your process as you build!"
  ];

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        content: "Hi! I'm your project assistant. Ask me for ideas or help with your projects!",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate a random response from the AI
  const getAiResponse = (userMessage: string) => {
    // Simple keyword matching for slightly better responses
    if (userMessage.toLowerCase().includes("stuck") || userMessage.toLowerCase().includes("help")) {
      return "Getting stuck is normal! Try breaking down your problem into smaller parts and tackle them one by one.";
    } else if (userMessage.toLowerCase().includes("idea") || userMessage.toLowerCase().includes("suggestion")) {
      return "How about creating a personal portfolio website? It's a great way to showcase your skills!";
    } else {
      return aiResponses[Math.floor(Math.random() * aiResponses.length)];
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAiResponse(input),
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Chat cleared. How can I help with your projects?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
    toast.info("Chat cleared");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="font-medium">Project Assistant</h2>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          aria-label="Clear chat"
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sender === "user"
                  ? "bg-primary text-white rounded-tr-none"
                  : "bg-secondary/50 rounded-tl-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary/50 rounded-2xl rounded-tl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for project advice..."
            className="flex-1 p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-primary text-white rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiChatBox;
