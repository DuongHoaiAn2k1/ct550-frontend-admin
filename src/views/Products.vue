<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">DANH SÁCH SẢN PHẨM</h1>
        <ol class="breadcrumb mb-4">
          <button type="button" class="btn btn-dark">
            <router-link style="text-decoration: none; color: #fff" :to="{ name: 'create-product' }">Thêm
              (+)</router-link>
          </button>
        </ol>
        <!-- Button trigger modal -->

        <!-- Modal -->

        <div class="card mb-4">
          <div class="card-body">
            <div class="form-group pull-right contain-search">
              <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                @change="handleSearch" v-model="search" />
            </div>
            <span class="counter pull-right"></span>
            <table class="table table-hover table-bordered results">
              <thead>
                <tr>
                  <th class="col text-center">STT</th>
                  <th class="col text-center">Tên sản phẩm</th>
                  <th class="col text-center">Hình ảnh</th>
                  <th class="col text-center">Giá
                    <button class="border-none" @click="sortByPrice">
                      <i class="fa-solid fa-sort"></i>
                    </button>
                  </th>
                  <th class="col text-center">Khối lượng
                    <button class="border-none" @click="sortByWeight">
                      <i class="fa-solid fa-sort"></i>
                    </button>
                  </th>
                  <th class="col text-center">Ngày tạo</th>
                  <th class="col text-center"></th>
                  <th class="col text-center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in datasearch" :key="product.product_id">
                  <th scope="row" class="text-center">{{ index + 1 }}</th>
                  <td class="text-center">{{ product.product_name }}</td>
                  <td class="text-center">
                    <img :src="apiUrl +
                      JSON.parse(product.product_img)[0]
                      " alt="Hình ảnh" width="50px" />
                  </td>

                  <td class="text-center">
                    {{ formatCurrency(product.product_price) }}
                  </td>
                  <td class="text-center">
                    {{ product.weight }} kg
                  </td>
                  <td class="text-center">
                    {{ convertTime(product.created_at) }}
                  </td>
                  <td class="text-center">
                    <button type="button" class="btn btn-sm btn-secondary design-button">
                      <router-link style="text-decoration: none; color: #fff" :to="{
                        name: 'update-product',
                        params: { id: product.product_id },
                      }">Chỉnh sửa</router-link>
                    </button>
                  </td>
                  <td class="text-center">
                    <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" width="200"
                      confirm-button-type="danger" title="Bạn có muốn xóa?" @confirm="handleDelete(product.product_id)">
                      <template #reference>
                        <el-button type="danger">Xóa</el-button>
                      </template>
                    </el-popconfirm>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-end">
              <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next"
                :total="Math.ceil((search ? datasearch.length : productStore.length) / pageSize) * 10" class="mt-4" />
            </div>
            <div v-show="datasearch.length === 0">
              <p class="text-center">Không có sản phẩm nào</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useProductStore } from "../stores/product";
import { deleteProduct } from "../utils/productUtils";
import { formatCurrency, convertTime } from "@/helpers/UtilHelper";
import { showLoading } from "../helpers/LoadingHelper";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const productStore = useProductStore();
const currentPage = ref(1);
const pageSize = 8;
const productsLength = ref(0);
const sortProductPoint = ref("ascending");

const search = ref("");

onMounted(async () => {
  await productStore.fetchListProduct();
  console.log(productStore.length);
});

const handleSearch = () => {
  console.log(search.value);
};

const datasearch = computed(() => {
  const dataSearch = String(search.value).trim();
  const startIndex = (currentPage.value - 1) * pageSize;
  const listProduct = productStore.getListProduct;
  if (!dataSearch) {
    return listProduct.slice(startIndex, startIndex + pageSize);
  }

  return listProduct.filter((data) => {
    return String(data.product_name)
      .toLowerCase()
      .includes(dataSearch.toLowerCase());
  });
});

const handleDelete = async (category_id) => {
  const loading = showLoading();
  try {
    await deleteProduct(category_id);
    await productStore.fetchListProduct();
  } catch (error) {
    console.error('Error deleting category:', error);
  } finally {
    loading.close();
  }

};

const sortByPrice = () => {
  const sorting = sortProductPoint.value === 'ascending' ? 1 : -1;
  if (sortProductPoint.value === 'ascending') {
    sortProductPoint.value = 'descending';
  } else {
    sortProductPoint.value = 'ascending';
  }
  productStore.getListProduct.sort((a, b) => (a.product_price - b.product_price) * sorting);
};


const sortByWeight = () => {
  const sorting = sortProductPoint.value === 'ascending' ? 1 : -1;
  if (sortProductPoint.value === 'ascending') {
    sortProductPoint.value = 'descending';
  } else {
    sortProductPoint.value = 'ascending';
  }
  productStore.getListProduct.sort((a, b) => (a.weight - b.weight) * sorting);
};

// observing current page
const handleCurrentChange = (val) => {
  currentPage.value = val;
  console.log(`current page: ${val}`);
};
</script>

<style scoped>
:deep(.el-pagination .el-pager .is-active) {
  background-color: black !important;
}

.contain-search {
  display: flex;
}

.form-design {
  width: 220px;
}

.design-input {
  border: none;
}

.design-button {
  padding: 4px 16px;
}
</style>