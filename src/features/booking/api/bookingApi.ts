import axiosInstance from "@/lib/axios";

export const getBookingsApi  = async () => {
  const response = await axiosInstance.get("/accounts/table-bookings");
  return response.data;
}