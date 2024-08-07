import categoryService from "@/services/category.service";
import { showSuccess, showWarning } from "@/helpers/NotificationHelper";
// Function to update category
const updateCategory = async (category_id, data) => {
  try {
    const response = await categoryService.update(category_id, data);
    showSuccess("Cập nhật danh mục thành công");
  } catch (error) {
    console.log(error.response);
  }
};

// Function to create category
const createCategory = async (data) => {
  try {
    const response = await categoryService.create(data);
    showSuccess("Thêm danh mục thành công");
  } catch (error) {
    console.log(error.response);
    if (error.response.data.message === "Danh mục đã tồn tại") {
      showWarning("Danh mục đã tồn tại");
    }
  }
};

// Function to delete category
const deleteCategory = async (category_id) => {
  try {
    const response = await categoryService.delete(category_id);
    showSuccess("Xóa danh mục thành công");
  } catch (error) {
    console.log(error.response);
  }
};

export { createCategory, deleteCategory, updateCategory };
