<template>
  <div id="layoutSidenav_content">
    <div class="container-fluid px-4">
      <ProductForm :formTitle="'CẬP NHẬT SẢN PHẨM'" :submitButtonText="'Cập nhật'" :initialProductData="product"
        :onSubmit="updateProduct" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "../stores/product";
import productService from "../services/product.service";
import ProductForm from "../components/Products/ProductForm.vue";
import { showSuccess } from '../helpers/NotificationHelper'
import { useRoute } from "vue-router";

const route = useRoute();
const productStore = useProductStore();
const product = ref({});
const productId = computed(() => route.params.id);

onMounted(async () => {

  const response = await productService.get(productId.value);
  product.value = response.data;
  setTimeout(() => {
    console.log('Product fetch::::: upate::::', product.value);
  }, 2000);
});

const updateProduct = async (productData) => {
  try {
    const response = await productService.update(productId.value, productData);
    console.log('Update product response: ', response);
    showSuccess('Cập nhật sản phẩm thành công');
  } catch (error) {
    console.log(error.response);
  }
};
</script>
