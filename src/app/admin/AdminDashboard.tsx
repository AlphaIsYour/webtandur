"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Mail,
  MailOpen,
  CheckCircle,
  ArrowUpRight,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  repliedMessages: number;
  totalUsers: number;
  responseTime: string;
  todayMessages: number;
}

interface RecentMessage {
  id: string;
  user: {
    name: string;
    email: string;
  };
  message: string;
  status: "UNREAD" | "READ" | "REPLIED";
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unreadMessages: 0,
    repliedMessages: 0,
    totalUsers: 0,
    responseTime: "0h",
    todayMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch("/api/admin/dashboard/stats");
      const statsData = await statsResponse.json();

      // Fetch recent messages
      const messagesResponse = await fetch("/api/admin/messages?limit=5");
      const messagesData = await messagesResponse.json();

      setStats(statsData.stats || stats);
      setRecentMessages(messagesData.messages || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
    trend,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color?: "blue" | "green" | "orange" | "red" | "purple";
    trend?: "up" | "down";
  }) => {
    const colorClasses = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50",
      green: "bg-green-500 text-green-600 bg-green-50",
      orange: "bg-orange-500 text-orange-600 bg-orange-50",
      red: "bg-red-500 text-red-600 bg-red-50",
      purple: "bg-purple-500 text-purple-600 bg-purple-50",
    };

    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className={`p-3 rounded-lg ${colorClasses[color].split(" ")[2]}`}
          >
            <Icon className={`w-6 h-6 ${colorClasses[color].split(" ")[1]}`} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <TrendingUp
              className={`w-4 h-4 mr-1 ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? "↗" : "↘"} vs last week
            </span>
          </div>
        )}
      </div>
    );
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your customer service.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages"
          value={stats.totalMessages}
          subtitle="All time"
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="Unread Messages"
          value={stats.unreadMessages}
          subtitle="Needs attention"
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Messages Today"
          value={stats.todayMessages}
          subtitle="Since midnight"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Registered customers"
          icon={Users}
          color="green"
        />
      </div>

      {/* Quick Actions & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/messages"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">View Messages</p>
                  <p className="text-sm text-gray-500">
                    {stats.unreadMessages} unread
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-500">
                    {stats.totalUsers} total users
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Messages
              </h3>
              <Link
                href="/admin/messages"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>

          <div className="divide-y">
            {recentMessages.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No recent messages</p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <div key={message.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(message.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {message.user.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {message.user.email}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {message.message.substring(0, 80)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Response Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Average Response Time
              </span>
              <span className="text-sm font-medium text-gray-900">
                {stats.responseTime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Messages Replied</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.repliedMessages}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="text-sm font-medium text-green-600">
                {stats.totalMessages > 0
                  ? Math.round(
                      (stats.repliedMessages / stats.totalMessages) * 100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Message Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Unread</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.unreadMessages}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Read</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalMessages -
                  stats.unreadMessages -
                  stats.repliedMessages}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Replied</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.repliedMessages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
