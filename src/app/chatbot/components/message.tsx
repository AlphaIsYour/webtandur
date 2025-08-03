/* eslint-disable prefer-const */
// app/chatbot/components/Message.tsx
"use client";

import React from "react";
import "../chatbot.css";

export interface MessageData {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp?: string;
}

interface MessageProps {
  message: MessageData;
}

// Enhanced markdown parsing for farming content
const parseMarkdown = (text: string) => {
  const paragraphs = text.split("\n");

  return paragraphs.map((paragraph, paragraphIndex) => {
    if (!paragraph.trim()) {
      return <br key={paragraphIndex} />;
    }

    // Enhanced processing for farming terms
    let processedText = paragraph
      .replace(/\*{2,}/g, "*") // Replace multiple asterisks with single
      .replace(/\*([^*]+)\*/g, "<strong>$1</strong>") // Convert *text* to bold
      .replace(/\*/g, "") // Remove any remaining single asterisks
      // Add some farming-specific formatting
      .replace(/(Rp\s?[\d.,]+)/g, "<strong style='color: #059669;'>$1</strong>") // Highlight prices
      .replace(/([0-9]+)\s?(kg|gram|ton|liter)/gi, "<strong>$1 $2</strong>") // Highlight quantities
      .replace(
        /(TERSEDIA|HABIS|PREORDER)/gi,
        "<span style='background: #dcfce7; padding: 2px 6px; border-radius: 4px; font-size: 0.8em;'>$1</span>"
      ); // Status badges

    return (
      <p
        key={paragraphIndex}
        style={{ margin: paragraphIndex === 0 ? "0" : "0.5em 0 0 0" }}
        dangerouslySetInnerHTML={{ __html: processedText }}
      />
    );
  });
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`message-container ${isUser ? "user" : "bot"}`}>
      <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
        {parseMarkdown(message.text)}
      </div>
      {message.timestamp && (
        <div className="message-timestamp">{message.timestamp}</div>
      )}
    </div>
  );
};

export default Message;
