import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogoutApi } from "../api/authApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export const useAdminLogout = () => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearClientSession = () => {
    if (typeof window !== "undefined") {
      // 1. Clear LocalStorage
      localStorage.clear();

      // 2. 🧹 Clear the user_role Cookie (Expire it)
      document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    setError(null);

    try {
      // Call Backend Logout API to invalidate/clear HttpOnly cookies
      await adminLogoutApi();
      toast.success("Logged out successfully");
      
      clearClientSession();

      setLoggingOut(false);
      router.push("/login");
      router.refresh();
      return true;
    } catch (err: any) {
      const errorMessage = extractErrorMessages(err);
      setError(errorMessage);
      toast.error(errorMessage);

      // Even if API fails, clear client side session and role cookies
      clearClientSession();

      setLoggingOut(false);
      return false;
    }
  };

  return { logout, loggingOut, error, setError };
};