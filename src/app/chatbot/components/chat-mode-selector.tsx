"use client";

import React from "react";
import "../chatbot.css";

interface ChatModeSelectorProps {
  onSelectMode: (mode: "chatbot" | "cs") => void;
  onLogout: () => void;
  userName: string;
}

const ChatModeSelector: React.FC<ChatModeSelectorProps> = ({
  onSelectMode,
  onLogout,
  userName,
}) => {
  return (
    <div className="chat-mode-selector">
      <div className="chat-mode-header">
        <div>
          <h3>Pilih Layanan</h3>
          <p className="welcome-text">Halo, {userName}!</p>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <div className="chat-mode-buttons">
        <button
          onClick={() => onSelectMode("chatbot")}
          className="mode-btn chatbot-btn"
        >
          <span>🤖</span>
          Chatbot AI
        </button>
        <button onClick={() => onSelectMode("cs")} className="mode-btn cs-btn">
          <span>👨‍💼</span>
          Hubungi CS
        </button>
      </div>
    </div>
  );
};

export default ChatModeSelector;
