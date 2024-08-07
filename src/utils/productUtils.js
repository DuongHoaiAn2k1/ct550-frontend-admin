import productService from "@/services/product.service";
import { showSuccess, showWarning } from "@/helpers/NotificationHelper";

const createProduct = async (data) => {
    try {
      console.log("Sending request with data:", data);
      const response = productService.create(data);
      showSuccess("Tạo sản phẩm thành công");
      console.log("Response from server:", response);
    } catch (error) {
      console.log(error.response);
    }
  };

const deleteProduct = async (id) => {
  try {
    const response = await productService.delete(id);
    showSuccess("Xóa sản phẩm thành công");
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

export { createProduct ,deleteProduct };
