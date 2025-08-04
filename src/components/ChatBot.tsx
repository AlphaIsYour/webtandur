"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, LogIn, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
  senderName?: string;
}

export default function LiveChat() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only show on homepage
  if (pathname !== "/") return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
      senderName: session?.user?.name || "Anda",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText.trim();
    setInputText("");
    setIsTyping(true);

    try {
      // Convert messages to the format expected by the API
      const apiMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // Add current user message
      apiMessages.push({
        role: "user",
        content: currentInput,
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text || "Maaf, terjadi kesalahan. Silakan coba lagi.",
        sender: "admin",
        timestamp: new Date(),
        senderName: "Eco Helper",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Maaf, terjadi kesalahan saat menghubungi server. Silakan coba lagi.",
        sender: "admin",
        timestamp: new Date(),
        senderName: "System",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const LoginPrompt = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <LogIn className="w-12 h-12 text-teal-500 mb-4" />
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Login Diperlukan
      </h3>
      <p className="text-slate-600 mb-4 text-sm">
        Silakan login terlebih dahulu untuk menghubungi customer service
      </p>
      <Link
        href="/auth/signin"
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Login Sekarang
      </Link>
    </div>
  );

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bg-teal-600 hover:bg-teal-700 text-white shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center
          md:bottom-0 md:right-6 md:w-36 md:h-12 md:rounded-t-xl md:z-50
          bottom-5 right-0 w-14 h-14 rounded-l-xl border-l-4 border-l-teal-500
          ${isOpen ? "md:block hidden" : "z-50"}
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 md:mr-2" />
            <span className="hidden md:block text-sm font-medium">
              Live Chat
            </span>
          </>
        )}
      </button>

      {/* Chat Popup with smooth animation */}
      <div
        className={`fixed flex flex-col transition-all duration-300 ease-in-out transform
          md:bottom-12 md:right-6 md:w-80 md:h-96 md:rounded-t-2xl md:rounded-bl-2xl md:z-40 md:shadow-2xl md:bg-white
          bottom-0 right-0 w-full h-full bg-white z-[60]
          ${
            isOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-full md:translate-y-8 opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 md:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Customer Service</h3>
              <p className="text-sm text-teal-100">
                {session ? "Tim kami siap membantu Anda" : "Login diperlukan"}
              </p>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-teal-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {session && (
            <div className="flex items-center mt-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-teal-100">Online</span>
            </div>
          )}
        </div>

        {/* Content */}
        {!session ? (
          <LoginPrompt />
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length === 0 && (
                <div className="text-center">
                  <div className="bg-white rounded-xl p-4 shadow-sm max-w-xs mx-auto">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <User className="w-5 h-5 text-teal-600" />
                    </div>
                    <p className="text-slate-600 text-sm">
                      Halo! Selamat datang di customer service kami. Ada yang
                      bisa kami bantu?
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-xs">
                    {message.sender === "admin" && (
                      <p className="text-xs text-slate-500 mb-1 px-1">
                        {message.senderName || "Customer Service"}
                      </p>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        message.sender === "user"
                          ? "bg-teal-600 text-white rounded-br-lg"
                          : "bg-white text-slate-800 rounded-bl-lg border border-slate-100"
                      }`}
                    >
                      {message.text}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-xs">
                    <p className="text-xs text-slate-500 mb-1 px-1">
                      Customer Service
                    </p>
                    <div className="bg-white text-slate-800 px-4 py-3 rounded-2xl rounded-bl-lg shadow-sm border border-slate-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-25 z-[55] md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
