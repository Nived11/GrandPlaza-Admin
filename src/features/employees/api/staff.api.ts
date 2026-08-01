import axiosInstance from "@/lib/axios";

export interface StaffPayload {
  username: string;
  email: string;
  phone_number: string;
  password?: string;
  role: string;
  address: string;
}

// 🟢 Get Staff List
export const getStaffsApi = async () => {
  const response = await axiosInstance.get("/accounts/admin/staff");
  return response.data;
};

// ➕ Create Staff
export const createStaffApi = async (data: StaffPayload) => {
  const response = await axiosInstance.post("/accounts/admin/staff", data);
  return response.data;
};

// ✏️ Update Staff
export const updateStaffApi = async (id: number | string, data: Partial<StaffPayload>) => {
  const response = await axiosInstance.patch(`/accounts/admin/staff/${id}`, data);
  return response.data;
};

// 🗑️ Delete Staff
export const deleteStaffApi = async (id: number | string) => {
  const response = await axiosInstance.delete(`/accounts/admin/staff/${id}`);
  return response.data;
};