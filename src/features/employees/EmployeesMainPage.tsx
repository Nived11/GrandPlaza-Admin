"use client";

import React, { useState, useEffect, useRef } from "react";

import { useStaff } from "./hooks/useStaff";
import { useDeliveryBoys } from "./hooks/useDeliveryBoys";

import EmployeeHeader from "./components/EmployeeHeader";
import StaffSection from "./components/StaffSection";
import DeliverySection from "./components/DeliverySection";
import EmployeeFormModal from "./components/EmployeeFormModal";
import DeliveryBoyFormModal from "./components/DeliveryBoyFormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function EmployeesMainPage() {
  const { 
    staffList, 
    loading: staffLoading, 
    actionLoading: staffActionLoading, 
    error: staffError, 
    setError: setStaffError,
    addStaff, 
    updateStaff, 
    deleteStaff 
  } = useStaff();

  const { 
    deliveryList, 
    loading: deliveryLoading, 
    actionLoading: deliveryActionLoading, 
    error: deliveryError, 
    setError: setDeliveryError,
    addDeliveryBoy, 
    updateDeliveryBoy, 
    deleteDeliveryBoy 
  } = useDeliveryBoys();

  const [staffSearch, setStaffSearch] = useState("");
  const [deliverySearch, setDeliverySearch] = useState("");

  // Modal States
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  // Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ type: "staff" | "delivery"; item: any } | null>(null);
  
  // 3-Dot Dropdown State
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
 const menuRef = useRef<HTMLDivElement>(null!);

  // Outside Click Handler to close 3-dot menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    let success = false;
    if (deleteTarget.type === "staff") {
      success = await deleteStaff(deleteTarget.item.id);
    } else {
      success = await deleteDeliveryBoy(deleteTarget.item.id);
    }
    if (success) {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--brand-cream-soft)] text-gray-900 p-2 sm:p-6 lg:p-8 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">
      
      {/*  HEADER */}
      <EmployeeHeader staffCount={staffList.length} ridersCount={deliveryList.length} />

      {/*  MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* ================= 1. STAFF SECTION ================= */}
        <StaffSection 
          staffList={staffList}
          staffLoading={staffLoading}
          staffSearch={staffSearch}
          setStaffSearch={setStaffSearch}
          onAddClick={() => { setSelectedStaff(null); setIsStaffModalOpen(true); }}
          onEditClick={(staff) => { setSelectedStaff(staff); setIsStaffModalOpen(true); setOpenMenuId(null); }}
          onDeleteClick={(staff) => { setDeleteTarget({ type: "staff", item: staff }); setOpenMenuId(null); }}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          menuRef={menuRef}
        />

        {/* ================= 2. DELIVERY SECTION ================= */}
        <DeliverySection 
          deliveryList={deliveryList}
          deliveryLoading={deliveryLoading}
          deliverySearch={deliverySearch}
          setDeliverySearch={setDeliverySearch}
          onAddClick={() => { setSelectedDelivery(null); setIsDeliveryModalOpen(true); }}
          onEditClick={(rider) => { setSelectedDelivery(rider); setIsDeliveryModalOpen(true); setOpenMenuId(null); }}
          onDeleteClick={(rider) => { setDeleteTarget({ type: "delivery", item: rider }); setOpenMenuId(null); }}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          menuRef={menuRef}
        />

      </div>

      {/*  MODALS */}
      <EmployeeFormModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        initialData={selectedStaff}
        isLoading={staffActionLoading}
        error={staffError}
        clearError={() => setStaffError(null)}
        onSubmit={async (data) => {
          if (selectedStaff) return await updateStaff(selectedStaff.id, data);
          return await addStaff(data);
        }}
      />

      <DeliveryBoyFormModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        initialData={selectedDelivery}
        isLoading={deliveryActionLoading}
        error={deliveryError}
        clearError={() => setDeliveryError(null)}
        onSubmit={async (data) => {
          if (selectedDelivery) return await updateDeliveryBoy(selectedDelivery.id, data);
          return await addDeliveryBoy(data);
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Account?"
        description={`Are you sure you want to delete ${deleteTarget?.item?.username}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={staffActionLoading || deliveryActionLoading}
        error={deleteTarget?.type === "staff" ? staffError : deliveryError}
        onClose={() => {
          setDeleteTarget(null);
          setStaffError(null);
          setDeliveryError(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
}