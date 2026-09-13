import axiosInstance from "@/lib/axios";

export interface ReviewItem {
  id: number;
  order: number;
  user_name: string;
  rating: number;
  rating_display: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export const getAdminReviewsApi = async (page = 1, search = "") => {
  const params: Record<string, any> = { page };
  if (search) params.search = search;
  const response = await axiosInstance.get("/feedback/admin", { params });
  return response.data;
};

export const toggleReviewApprovalApi = async (
  id: number,
  is_approved: boolean
) => {
  const response = await axiosInstance.patch(`/feedback/admin/${id}`, {
    is_approved,
  });
  return response.data;
};
