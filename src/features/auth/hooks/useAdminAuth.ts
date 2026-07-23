import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginApi, LoginCredentials } from "../api/authApi";
import { toast } from "sonner";

export const useAdminAuth = () => {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      await adminLoginApi(credentials);
      
      // Backend automatically sets HttpOnly cookie (or access_token)
      toast.success("Welcome back, Admin!");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Invalid credentials. Access denied.";
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