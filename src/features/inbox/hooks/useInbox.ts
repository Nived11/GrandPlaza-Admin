"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getInboxMessagesApi,
  getUnreadCountApi,
  updateMessageReadStatusApi,
  deleteInboxMessageApi,
  ContactMessage,
} from "../api/inboxApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export function useInbox(initialSearch = "", initialStatus = "all") {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Fetch unread count for badge
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadCountApi();
      if (typeof data?.unread_count === "number") {
        setUnreadCount(data.unread_count);
      }
    } catch {
      // Non-critical background fetch
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getInboxMessagesApi(page, searchQuery, statusFilter);

      if (data && Array.isArray(data.results)) {
        setMessages(data.results);
        setTotalCount(data.count || 0);
        setHasNextPage(Boolean(data.next));
        setHasPreviousPage(Boolean(data.previous));
      } else if (Array.isArray(data)) {
        setMessages(data);
        setTotalCount(data.length);
        setHasNextPage(false);
        setHasPreviousPage(false);
      } else {
        setMessages([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error("Error fetching inbox messages:", err);
      const msg = extractErrorMessages(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [fetchMessages, fetchUnreadCount]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  // Toggle Read / Unread
  const toggleReadStatus = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      await updateMessageReadStatusApi(id, newStatus);
      toast.success(newStatus ? "Message marked as read" : "Message marked as unread");
      
      // Update local state instantly
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, is_read: newStatus } : msg))
      );
      setUnreadCount((prev) => Math.max(0, prev + (newStatus ? -1 : 1)));
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
    }
  };

  // Delete message
  const deleteMessage = async (id: number) => {
    try {
      await deleteInboxMessageApi(id);
      toast.success("Message deleted successfully");
      
      // Refresh list & unread count
      fetchMessages();
      fetchUnreadCount();
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    }
  };

  return {
    messages,
    loading,
    error,
    page,
    setPage,
    totalCount,
    unreadCount,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    hasNextPage,
    hasPreviousPage,
    fetchMessages,
    fetchUnreadCount,
    toggleReadStatus,
    deleteMessage,
  };
}
