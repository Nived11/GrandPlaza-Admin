import axiosInstance from "@/lib/axios";

export interface CategoryPayload {
  name: string;
  image?: File | null | string;
}

// 🟢 Get Category List
export const getCategoriesApi = async (search?: string) => {
  const url = search ? `/menu/admin/categories?search=${search}` : "/menu/admin/categories/";
  const response = await axiosInstance.get(url);
  return response.data;
};

// ➕ Create Category
export const createCategoryApi = async (data: CategoryPayload) => {
  const formData = new FormData();
  formData.append("name", data.name);
  
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  const response = await axiosInstance.post("/menu/admin/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ✏️ Update Category
export const updateCategoryApi = async (id: number | string, data: Partial<CategoryPayload>) => {
  const formData = new FormData();
  
  if (data.name) {
    formData.append("name", data.name);
  }
  
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  const response = await axiosInstance.patch(`/menu/admin/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 🗑️ Delete Category
export const deleteCategoryApi = async (id: number | string) => {
  const response = await axiosInstance.delete(`/menu/admin/categories/${id}`);
  return response.data;
};