import axiosInstance from "@/lib/axios";

export const getBookingsApi = async () => {
  const response = await axiosInstance.get("/accounts/table-bookings");
  return response.data;
};

export const updateBookingStatusApi = async (id: number, status: string) => {
  const response = await axiosInstance.patch(`/accounts/table-bookings/${id}`, {
    status,
  });
  return response.data;
};

export const deleteBookingApi = async (id: number) => {
  const response = await axiosInstance.delete(`/accounts/table-bookings/${id}`);
  return response.data;
};
