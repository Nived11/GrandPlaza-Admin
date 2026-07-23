import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogoutApi } from "../api/authApi";
import { toast } from "sonner";

export const useAdminLogout = () => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    try {
      // 1. Call Backend Logout API to invalidate/clear HttpOnly cookies
      await adminLogoutApi();
      toast.success("Logged out successfully");
    } catch (err) {
      // Even if API fails, clear client side session anyway
      console.warn("Logout API error, clearing client state regardless:", err);
    } finally {
      // 2. Clear Local Storage and redirect to Login
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      setLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  };

  return { logout, loggingOut };
};