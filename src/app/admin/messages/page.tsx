"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  X,
  Mail,
  MailOpen,
  CheckCircle,
  Clock,
  User,
  Send,
} from "lucide-react";

interface CsMessage {
  id: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED";
  adminReply?: string;
  createdAt: string;
  repliedAt?: string;
  user: {
    name: string;
    email: string;
  };
}

const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<CsMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<CsMessage | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch messages dari database
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/admin/messages");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          reply: replyText,
          adminEmail: "admin@example.com",
        }),
      });

      if (response.ok) {
        await fetchMessages();
        setReplyText("");
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error replying:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/admin/messages/${messageId}/read`, {
        method: "PATCH",
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId && msg.status === "UNREAD"
            ? { ...msg, status: "READ" as const }
            : msg
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UNREAD":
        return <Mail className="w-4 h-4 text-red-500" />;
      case "READ":
        return <MailOpen className="w-4 h-4 text-orange-500" />;
      case "REPLIED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "UNREAD":
        return "Belum Dibaca";
      case "READ":
        return "Sudah Dibaca";
      case "REPLIED":
        return "Sudah Dibalas";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNREAD":
        return "bg-red-100 text-red-800 border-l-red-500";
      case "READ":
        return "bg-orange-100 text-orange-800 border-l-orange-500";
      case "REPLIED":
        return "bg-green-100 text-green-800 border-l-green-500";
      default:
        return "bg-gray-100 text-gray-800 border-l-gray-500";
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Customer Messages
            </h1>
            <p className="text-gray-600 mt-1">
              {messages.filter((m) => m.status === "UNREAD").length} unread
              messages
            </p>
          </div>
          <button
            onClick={fetchMessages}
            disabled={fetchLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${fetchLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Inbox ({messages.length})
            </h2>
          </div>

          <div className="divide-y max-h-[calc(100vh-300px)] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No messages found</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${getStatusColor(
                    msg.status
                  )}`}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === "UNREAD") {
                      markAsRead(msg.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">
                        {msg.user.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(msg.status)}
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {msg.message.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      {msg.user.name}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        msg.status === "UNREAD"
                          ? "bg-red-100 text-red-800"
                          : msg.status === "READ"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getStatusText(msg.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-lg shadow-sm border">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Message Details
                  </h3>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedMessage.user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedMessage.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(selectedMessage.createdAt).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                </div>

                {/* Original Message */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Customer Message:
                  </h4>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Admin Reply */}
                {selectedMessage.adminReply && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Your Reply:
                    </h4>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {selectedMessage.adminReply}
                      </p>
                      {selectedMessage.repliedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Replied:{" "}
                          {new Date(selectedMessage.repliedAt).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Reply Section */}
                {selectedMessage.status !== "REPLIED" && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Send Reply:
                    </h4>
                    <div className="space-y-4">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <button
                        onClick={() => handleReply(selectedMessage.id)}
                        disabled={isLoading || !replyText.trim()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;
