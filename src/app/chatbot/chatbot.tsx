/* eslint-disable @typescript-eslint/no-unused-vars */
// app/chatbot/Chatbot.tsx
"use client";

import React, { useState } from "react";
import ChatFab from "@/app/chatbot/components/chatfab";
import ChatPopup from "@/app/chatbot/components/chatpopup";
import { MessageData } from "@/app/chatbot/components/message";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([
    {
      id: "initial-1",
      text: "Halo! Saya TaniBot, asisten AI untuk platform pertanian Indonesia! Ada yang bisa saya bantu terkait produk pertanian, petani, proyek tani, atau informasi lainnya? 🌾",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (messageText: string) => {
    const userMessage: MessageData = {
      id: Date.now().toString() + "-user",
      text: messageText,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Format chat history for API (exclude initial message)
      const chatHistory = messages
        .filter((msg) => msg.id !== "initial-1")
        .slice(-6); // Keep last 6 messages for context

      const formattedMessages = [
        ...chatHistory.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        {
          role: "user",
          content: messageText,
        },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let botText = "";
      try {
        const data = JSON.parse(responseText);
        botText = data.text || data.error || "Maaf, terjadi kesalahan.";
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        botText = responseText || "Maaf, terjadi kesalahan parsing response.";
      }

      const botMessage: MessageData = {
        id: Date.now().toString() + "-bot",
        text: botText,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: MessageData = {
        id: Date.now().toString() + "-error",
        text: "Waduh, sepertinya ada kendala teknis. Coba lagi dalam beberapa saat ya! 😅",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ChatFab onClick={toggleChat} isOpen={isOpen} />
      <ChatPopup
        isOpen={isOpen}
        onClose={toggleChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        botName="TaniBot AI" // Update bot name
      />
    </>
  );
};

export default Chatbot;
