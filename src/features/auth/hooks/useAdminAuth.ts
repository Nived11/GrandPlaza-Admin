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

      // Save role & username for client-side filtering & cookie fallback
      if (typeof window !== "undefined") {
        localStorage.setItem("user_role", role);
        localStorage.setItem("username", username);
        document.cookie = `user_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      }

      // Dynamic Toast based on Role
      if (role === "admin") {
        toast.success("Welcome back, Admin!");
      } else {
        toast.success(`Welcome back, ${username}!`);
      }

      router.push("/");
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