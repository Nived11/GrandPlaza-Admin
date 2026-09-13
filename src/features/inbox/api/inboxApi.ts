import axiosInstance from "@/lib/axios";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const getInboxMessagesApi = async (
  page = 1,
  search = "",
  status = ""
) => {
  const params: Record<string, any> = { page };
  if (search) params.search = search;
  if (status && status !== "all") params.status = status;
  const response = await axiosInstance.get("/accounts/contact", { params });
  return response.data;
};

export const getUnreadCountApi = async () => {
  const response = await axiosInstance.get("/accounts/contact/unread-count");
  return response.data;
};

export const updateMessageReadStatusApi = async (
  id: number,
  is_read: boolean
) => {
  const response = await axiosInstance.patch(`/accounts/contact/${id}`, {
    is_read,
  });
  return response.data;
};

export const deleteInboxMessageApi = async (id: number) => {
  const response = await axiosInstance.delete(`/accounts/contact/${id}`);
  return response.data;
};
