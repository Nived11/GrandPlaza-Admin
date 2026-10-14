import axiosInstance from "@/lib/axios";

export const getCustomersApi = async (
  page = 1,
  search = "",
  filter = "all",
  sort = "newest"
) => {
  const params: Record<string, any> = { page };
  if (search) params.search = search;
  if (filter && filter !== "all") params.filter = filter;
  if (sort) params.sort = sort;

  const response = await axiosInstance.get("/accounts/admin/customers", { params });
  return response.data;
};

// 🌟 Toggle Block API
export const toggleBlockCustomerApi = async (id: number) => {
  const response = await axiosInstance.patch(`/accounts/admin/customers/${id}/toggle-block`);
  return response.data;
};

// 📜 Fetch Customer Complete Orders History
export const getCustomerOrdersApi = async (id: number) => {
  const response = await axiosInstance.get(`/accounts/admin/customers/${id}/orders`);
  return response.data;
};