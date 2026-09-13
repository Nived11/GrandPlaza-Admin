"use client";

import React, { useState } from "react";
import InboxHeader from "./components/InboxHeader";
import InboxSearch from "./components/InboxSearch";
import InboxTable from "./components/InboxTable";
import InboxTableSkeleton from "./components/InboxTableSkeleton";
import InboxMessageModal from "./components/InboxMessageModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { useInbox } from "./hooks/useInbox";
import { ContactMessage } from "./api/inboxApi";

export default function InboxMainPage() {
  const {
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
    toggleReadStatus,
    deleteMessage,
  } = useInbox();

  // Selected message for View Modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Message delete confirmation modal state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenViewModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsViewModalOpen(true);
    // If opening an unread message, mark it as read automatically
    if (!msg.is_read) {
      toggleReadStatus(msg.id, false);
      setSelectedMessage({ ...msg, is_read: true });
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedMessage(null);
  };

  const handleRequestDelete = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    setIsDeleting(true);
    const success = await deleteMessage(deleteTargetId);
    setIsDeleting(false);
    if (success) {
      setDeleteTargetId(null);
      if (selectedMessage?.id === deleteTargetId) {
        handleCloseViewModal();
      }
    }
  };

  return (
    <div className="min-h-screen w-full text-slate-900 p-2 sm:p-4 lg:p-4 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">
      
      {/* 🟢 Header */}
      <InboxHeader unreadCount={unreadCount} />

      {/* 🔍 Search Bar & Status Tabs */}
      <div className="px-2 sm:px-6">
        <InboxSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          unreadCount={unreadCount}
        />
      </div>

      {/* 📊 Content Table / Skeleton Loading / Error */}
      {loading ? (
        <div className="px-2 sm:px-6">
          <InboxTableSkeleton rowCount={10} />
        </div>
      ) : error ? (
        <div className="px-2 sm:px-6 py-12 text-center">
          <p className="text-xs font-bold text-red-500">{error}</p>
        </div>
      ) : (
        <div className="px-2 sm:px-6 space-y-4">
          <InboxTable
            messages={messages}
            onView={handleOpenViewModal}
            onToggleRead={toggleReadStatus}
            onDeleteRequest={handleRequestDelete}
          />

          {/* 🟢 Reusable Pagination */}
          <Pagination
            page={page}
            totalCount={totalCount}
            pageSize={10}
            onPageChange={setPage}
            isLoading={loading}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </div>
      )}

      {/* 📩 Message Details Modal */}
      <InboxMessageModal
        message={selectedMessage}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onToggleRead={(id, status) => {
          toggleReadStatus(id, status);
          if (selectedMessage) {
            setSelectedMessage({ ...selectedMessage, is_read: !status });
          }
        }}
      />

      {/* 🗑️ Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Message"
        description="Are you sure you want to permanently delete this customer message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

    </div>
  );
}
