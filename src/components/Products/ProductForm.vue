<!-- ProductForm.vue -->
<template>
    <form @submit="handleSubmit" class="row g-3 mt-2" enctype="multipart/form-data">
        <fieldset>
            <!-- Form Name -->
            <legend class="fs-4">
                <h1>{{ formTitle }}</h1>
            </legend>

            <!-- Text input-->
            <div class="mb-3 row">
                <label for="product_name" class="col-sm-4 col-form-label">TÊN SẢN PHẨM</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" id="product_name" name="product_name"
                        v-model="productData.product_name" placeholder="Tên sản phẩm" />
                    <div class="ms-1 text-danger">
                        {{ productNameError }}
                    </div>
                </div>
            </div>

            <!-- File input-->
            <div class="mb-3 row">
                <label for="product_img" class="col-sm-4 col-form-label">HÌNH ẢNH SẢN PHẨM</label>
                <div class="col-sm-8">
                    <input type="file" class="form-control" id="product_img" multiple @change="handleImageUpload"
                        name="product_img" placeholder="" />
                    <div class="ms-1 text-danger">
                        {{ productImgError }}
                    </div>
                </div>
            </div>

            <!-- Textarea -->
            <div class="mb-3 row">
                <label for="product_des" class="col-sm-4 col-form-label">MÔ TẢ SẢN PHẨM</label>
                <div class="col-sm-8">
                    <textarea name="product_des" class="form-control" v-model="productData.product_des" id="product_des"
                        cols="30" rows="10"></textarea>
                    <div class="ms-1 text-danger">
                        {{ productDesError }}
                    </div>
                </div>
            </div>

            <!-- Select input -->
            <div class="mb-3 row">
                <label for="category_id" class="col-sm-4 col-form-label">DANH MỤC SẢN PHẨM</label>
                <div class="col-sm-8">
                    <select class="form-control" id="category_id" name="category_id" v-model="productData.category_id"
                        placeholder="AVAILABLE QUANTITY">
                        <option disabled value="">--Chọn--</option>
                        <option v-for="category in categoryStore.listCategory" :key="category.category_id"
                            :value="category.category_id">
                            {{ category.category_name }}
                        </option>
                    </select>
                    <div class="ms-1 text-danger">
                        {{ categoryIdError }}
                    </div>
                </div>
            </div>

            <!-- Text input-->
            <div class="mb-3 row">
                <label for="product_price" class="col-sm-4 col-form-label">GIÁ BÁN</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" id="product_price" name="product_price"
                        placeholder="Giá bán" v-model="productData.product_price" />
                    <div class="ms-1 text-danger">
                        {{ productPriceError }}
                    </div>
                </div>
            </div>

            <!-- Text input-->
            <div class="mb-3 row">
                <label for="product_quantity" class="col-sm-4 col-form-label">SỐ LƯỢNG CÓ SẴN</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" id="product_quantity" name="product_quantity"
                        placeholder="Số lượng có sẵn" v-model="productData.product_quantity" />
                    <div class="ms-1 text-danger">
                        {{ productQuantityError }}
                    </div>
                </div>
            </div>

            <!-- Button -->
            <div class="mb-3 row">
                <div class="col-sm-4"></div>
                <div class="col-sm-8">
                    <button type="submit" class="btn btn-dark">{{ submitButtonText }}</button>
                </div>
            </div>
        </fieldset>
    </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import * as Yup from "yup";
import { useCategoryStore } from "@/stores/category";
import { ElLoading, ElNotification } from "element-plus";

const props = defineProps({
    formTitle: {
        type: String,
        required: true
    },
    submitButtonText: {
        type: String,
        required: true
    },
    initialProductData: {
        type: Object,
        required: true
    },
    onSubmit: {
        type: Function,
        required: true
    }
});

const categoryStore = useCategoryStore();
const productData = ref({ ...props.initialProductData });

const productNameError = ref("");
const productImgError = ref("");
const productDesError = ref("");
const categoryIdError = ref("");
const productPriceError = ref("");
const productQuantityError = ref("");

const schema = Yup.object().shape({
    product_name: Yup.string().required("Tên sản phẩm không được để trống"),
    product_img: Yup.array()
        .min(3, "Phải tải lên ít nhất 3 hình ảnh")
        .max(3, "Chỉ được tải lên tối đa 3 hình ảnh"),
    product_des: Yup.string().required("Mô tả sản phẩm không được để trống"),
    category_id: Yup.string().required("Danh mục sản phẩm không được để trống"),
    product_price: Yup.string().required("Giá bán sản phẩm không được để trống"),
    product_quantity: Yup.string().required(
        "Số lượng sản phẩm không được để trống"
    ),
});

const handleImageUpload = (event) => {
    const imageFiles = event.target.files;
    if (imageFiles && imageFiles.length > 0) {
        productData.value.product_img = Array.from(imageFiles);
    }
};

const handleSubmit = (event) => {
    event.preventDefault();
    productNameError.value = null;
    productImgError.value = null;
    productDesError.value = null;
    categoryIdError.value = null;
    productPriceError.value = null;
    productQuantityError.value = null;

    schema
        .validate(productData.value, { abortEarly: false })
        .then(() => {
            productNameError.value = null;
            productImgError.value = null;
            productDesError.value = null;
            categoryIdError.value = null;
            productPriceError.value = null;
            productQuantityError.value = null;

            const productDataUpdate = new FormData();
            for (const key in productData.value) {
                if (key !== "product_img") {
                    productDataUpdate.append(key, productData.value[key]);
                }
            }
            if (productData.value.product_img) {
                for (const img of productData.value.product_img) {
                    productDataUpdate.append("product_img[]", img);
                }
            }
            const loading = ElLoading.service({
                lock: true,
                text: "Đang xử lý...",
                background: "rgba(0,0,0, 0.7)",
            });
            setTimeout(() => {
                props.onSubmit(productDataUpdate);
                loading.close();
            }, 2000);
        })
        .catch((errors) => {
            if (errors && errors.inner) {
                errors.inner.forEach((error) => {
                    if (error.path === "product_name") {
                        productNameError.value = error.message;
                    }
                    if (error.path === "product_img") {
                        productImgError.value = error.message;
                    }
                    if (error.path === "product_des") {
                        productDesError.value = error.message;
                    }
                    if (error.path === "category_id") {
                        categoryIdError.value = error.message;
                    }
                    if (error.path === "product_price") {
                        productPriceError.value = error.message;
                    }
                    if (error.path === "product_quantity") {
                        productQuantityError.value = error.message;
                    }
                });
            }
        });
};

watch(() => props.initialProductData, (newData) => {
    productData.value = { ...newData };
});

onMounted(async () => {
    await categoryStore.fetchListCategory();
});
</script>