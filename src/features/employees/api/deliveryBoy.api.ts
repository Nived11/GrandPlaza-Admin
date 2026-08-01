import axiosInstance from "@/lib/axios";

export interface DeliveryBoyPayload {
  username: string;
  email: string;
  phone_number: string;
  password?: string;
  address: string;
  vehicle_number: string;
}

// 🟢 Get Delivery Boys List
export const getDeliveryBoysApi = async () => {
  const response = await axiosInstance.get("/accounts/admin/delivery-boys");
  return response.data;
};

// ➕ Create Delivery Boy
export const createDeliveryBoyApi = async (data: DeliveryBoyPayload) => {
  const response = await axiosInstance.post("/accounts/admin/delivery-boys", data);
  return response.data;
};

// ✏️ Update Delivery Boy
export const updateDeliveryBoyApi = async (id: number | string, data: Partial<DeliveryBoyPayload>) => {
  const response = await axiosInstance.patch(`/accounts/admin/delivery-boys/${id}`, data);
  return response.data;
};

// 🗑️ Delete Delivery Boy
export const deleteDeliveryBoyApi = async (id: number | string) => {
  const response = await axiosInstance.delete(`/accounts/admin/delivery-boys/${id}`);
  return response.data;
};