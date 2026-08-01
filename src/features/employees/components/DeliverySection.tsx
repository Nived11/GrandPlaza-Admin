"use client";

import React from "react";
import { 
  Bike, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  Truck, 
  MoreVertical, 
  Edit2, 
  Trash2 
} from "lucide-react";
import EmployeeSkeleton from "./EmployeeSkeleton";

interface Props {
  deliveryList: any[];
  deliveryLoading: boolean;
  deliverySearch: string;
  setDeliverySearch: (val: string) => void;
  onAddClick: () => void;
  onEditClick: (rider: any) => void;
  onDeleteClick: (rider: any) => void;
  openMenuId: string | number | null;
  setOpenMenuId: (id: string | number | null) => void;
  menuRef: any;
}

export default function DeliverySection({
  deliveryList,
  deliveryLoading,
  deliverySearch,
  setDeliverySearch,
  onAddClick,
  onEditClick,
  onDeleteClick,
  openMenuId,
  setOpenMenuId,
  menuRef,
}: Props) {
  const filteredDelivery = deliveryList.filter((d) => 
    (d.username || "").toLowerCase().includes(deliverySearch.toLowerCase()) || 
    (d.first_name || "").toLowerCase().includes(deliverySearch.toLowerCase()) ||
    (d.last_name || "").toLowerCase().includes(deliverySearch.toLowerCase()) ||
    (d.delivery_profile?.vehicle_number || d.vehicle_number || "").toLowerCase().includes(deliverySearch.toLowerCase())
  );

  return (
    <section className="bg-white border border-gray-200/80 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg flex flex-col space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-3xl bg-[var(--brand-green-dark)] text-brand-cream flex items-center justify-center shadow-md shrink-0">
            <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-left">
            <h2 className="text-sm sm:text-lg font-black tracking-wide text-gray-900 font-sans uppercase">
              Delivery Partners
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium leading-none">Active fleet & order riders</p>
          </div>
        </div>

        <button 
          onClick={onAddClick}
          className="bg-[var(--brand-green-dark)] hover:bg-[var(--brand-green-light)] text-brand-cream border border-brand-gold px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs flex items-center gap-1 sm:gap-2 transition shadow-md cursor-pointer shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Add Rider</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text"
          placeholder="Search rider..."
          value={deliverySearch}
          onChange={(e) => setDeliverySearch(e.target.value)}
          className="w-full pl-8 sm:pl-11 pr-3 py-2 sm:py-3 text-[11px] sm:text-xs bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-500 outline-none focus:border-[var(--brand-green-dark)] focus:bg-white transition font-medium"
        />
      </div>

      {/* List / Skeleton / Empty */}
      {deliveryLoading ? (
        <EmployeeSkeleton />
      ) : filteredDelivery.length === 0 ? (
        <p className="text-xs text-gray-500 py-6 text-center font-medium">No delivery riders found.</p>
      ) : (
        <div className="space-y-2.5 pt-1">
          {filteredDelivery.map((rider) => {
            const fullName = [rider.first_name, rider.last_name].filter(Boolean).join(" ");
            const vehicleNum = rider.delivery_profile?.vehicle_number || rider.vehicle_number;
            
            return (
              <div 
                key={rider.id}
                className="p-2.5 sm:p-4 rounded-xl bg-white border border-gray-200/80 hover:border-[var(--brand-green-dark)]/50 transition flex items-center justify-between gap-2 shadow-sm relative"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full sm:rounded-3xl bg-[var(--brand-green-dark)] text-brand-cream font-bold text-xs sm:text-base flex items-center justify-center shadow-md shrink-0">
                    {(fullName || rider.username || "D").charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left min-w-0 space-y-0.5">
                    
                    {/* 📌 Top ID Chip */}
                    <span className="inline-block text-[8px] sm:text-[9px] font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.2 rounded border border-gray-200">
                      {rider.employee_id || `DB-${rider.id}`}
                    </span>

                    {/* Top Row: Full Name + Vehicle Number Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-black text-gray-900 truncate">
                        {fullName || "N/A"}
                      </h3>
                      <span className="text-[9px] sm:text-[10px] font-bold text-[var(--brand-green-dark)] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                        <Truck className="w-2.5 h-2.5" /> {vehicleNum || "N/A"}
                      </span>
                    </div>
                    
                    {/* Bottom Row: Username + Phone + Email */}
                    <div className="flex items-center gap-2 flex-wrap text-gray-700 font-semibold text-[9px] sm:text-[11px]">
                      <span className="text-gray-800 font-bold">
                        @{rider.username}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 shrink-0" /> {rider.phone_number || "N/A"}
                      </span>
                      {rider.email && (
                        <span className="hidden sm:flex items-center gap-0.5 text-gray-600">
                          <Mail className="w-2.5 h-2.5 text-gray-500 shrink-0" /> {rider.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 bg-sky-100 text-sky-800 border border-sky-300 whitespace-nowrap">
                    Active
                  </span>

                  <button 
                    onClick={() => setOpenMenuId(openMenuId === `d-${rider.id}` ? null : `d-${rider.id}`)}
                    className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl text-gray-600 hover:text-gray-900 transition cursor-pointer"
                  >
                    <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {openMenuId === `d-${rider.id}` && (
                    <div ref={menuRef} className="absolute right-0 top-8 sm:top-10 z-20 w-28 sm:w-32 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-1 space-y-0.5 animate-in fade-in">
                      <button 
                        onClick={() => onEditClick(rider)}
                        className="w-full px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-gray-800 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-blue-600" /> Edit
                      </button>
                      <button 
                        onClick={() => onDeleteClick(rider)}
                        className="w-full px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}