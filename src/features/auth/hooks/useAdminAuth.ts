import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginApi, LoginCredentials } from "../api/authApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export const useAdminAuth = () => {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await adminLoginApi(credentials);
      
      const user = data?.user;
      const role = user?.role || "employee";
      const username = user?.username || credentials.username;

      // Save verified backend role & username for client-side routing & UI
      if (typeof window !== "undefined") {
        document.cookie = `user_role=${role}; path=/; max-age=2592000; SameSite=Lax`;
        localStorage.setItem("user_role", role);
        localStorage.setItem("username", username);
      }

      // Dynamic Toast & Landing Destination based on Role
      if (role === "admin") {
        toast.success("Welcome back, Admin!");
        router.push("/");
      } else {
        toast.success(`Welcome back, ${username}! (Kitchen Staff)`);
        router.push("/orders");
      }

      router.refresh();
    } catch (err: any) {
      const errorMessage = extractErrorMessages(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};