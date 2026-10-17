"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";

interface AdminRoleGuardProps {
  children: React.ReactNode;
}

export default function AdminRoleGuard({ children }: AdminRoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };

      const cookieRole = getCookie("user_role");
      const localRole = localStorage.getItem("user_role");
      const currentRole = cookieRole || localRole || "employee";

      if (currentRole === "admin") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        toast.error("Access Denied: Administrator privileges required.");
        router.replace("/orders");
      }
    }
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 size={32} className="animate-spin text-brand-gold" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Verifying Permissions...
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-sm font-black uppercase text-slate-800">Access Restricted</h2>
        <p className="text-xs text-gray-500 max-w-sm">
          You do not have administrative privileges to view this page. Redirecting to Live Orders...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
