<template>
  <div id="layoutSidenav_content">
    <div class="container-fluid px-4">
      <ProductForm :formTitle="'CẬP NHẬT SẢN PHẨM'" :submitButtonText="'Cập nhật'" :initialProductData="product"
        :onSubmit="updateProduct" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "../stores/product";
import productService from "../services/product.service";
import ProductForm from "../components/Products/ProductForm.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const productStore = useProductStore();
const product = ref({});

onMounted(async () => {
  const productId = route.params.id;
  const response = await productService.get(productId);
  product.value = response.data;
  setTimeout(() => {
    console.log('Product fetch::::: upate::::', product.value);
  }, 2000);
});

const updateProduct = async (productData) => {
  try {
    const response = await productStore.updateProduct(product.id, productData);
    ElNotification({
      title: "Thành công",
      message: "Cập nhật sản phẩm thành công!",
      type: "success",
    });
  } catch (error) {
    ElNotification({
      title: "Thất bại",
      message: "Cập nhật sản phẩm thất bại!",
      type: "error",
    });
  }
};
</script>
