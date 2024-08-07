<template>
  <div id="layoutSidenav_content">
    <div class="container-fluid px-4">
      <ProductForm :formTitle="'THÊM SẢN PHẨM'" :submitButtonText="'Thêm'" :initialProductData="initialProductData"
        :onSubmit="createProduct" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import productService from "../services/product.service";
import ProductForm from "../components/Products/ProductForm.vue";
import { showSuccess, showError } from "@/helpers/NotificationHelper";
import { useRouter } from "vue-router";

const router = useRouter();

const initialProductData = ref({
  product_name: "",
  product_img: [],
  product_des: "",
  category_id: "",
  product_price: "",
  product_quantity: "",
});

const createProduct = async (productData) => {
  try {
    const response = await productService.create(productData);
    showSuccess("Thêm sản phẩm thành công");
    setTimeout(() => {
      router.push({ name: "product" });
    }, 1000);
  } catch (error) {
    console.log(error.response);
    showError("Thêm sản phẩm thất bại");
  }
};
</script>
