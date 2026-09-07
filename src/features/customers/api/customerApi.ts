import axiosInstance from "@/lib/axios";

export const getCustomersApi = async () => {
  const response = await axiosInstance.get("/accounts/admin/customers");
  return response.data;
};