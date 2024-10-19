<template>
    <div class="card-body">
        <div class="form-group pull-right contain-search">
            <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                @change="handleSearch" v-model="search" />

        </div>

        <table class="table table-hover table-bordered results">
            <thead>
                <tr>
                    <th class="col text-center">STT</th>
                    <th class="col text-center">Tên sản phẩm</th>
                    <th class="col text-center">Hình ảnh</th>
                    <th class="col text-center">Số lượng trong kho</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in datasearch" :key="product.product_id">
                    <th scope="row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center">{{ product.product_name }}</td>
                    <td class="text-center">
                        <img :src="apiUrl + JSON.parse(product.product_img)[0]" alt="Hình ảnh" width="50px" />
                    </td>
                    <td class="text-center">
                        {{ product.product_quantity }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" size="small"
                background layout="prev, pager, next"
                :total="Math.ceil((search ? datasearch.length : productBatchStore.length) / pageSize) * 10"
                class="mt-4" />
        </div>
        <div v-show="datasearch.length === 0">
            <p class="text-center">Không có sản phẩm nào</p>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useProductBatchStore } from '../../stores/productBatch';
import { initializeEcho } from '@/pusher/echoConfig';
const apiUrl = import.meta.env.VITE_APP_API_URL;
const echoInstance = initializeEcho();
const productBatchStore = useProductBatchStore();
const currentPage = ref(1);
const pageSize = 8;
const search = ref("");
const handleSearch = () => {
    console.log(search.value);
};

echoInstance.channel('admin-channel').listen('.order.cancelled', async (event) => {
    productBatchStore.fetchListProductBatch();
});
const datasearch = computed(() => {
    const dataSearch = String(search.value).trim();
    const startIndex = (currentPage.value - 1) * pageSize;
    if (!dataSearch) {
        return productBatchStore.listProductBatch.slice(startIndex, startIndex + pageSize);
    }
    return productBatchStore.listProductBatch.filter((data) => {
        return String(data.product_name)
            .toLowerCase()
            .includes(dataSearch.toLowerCase());
    });
});

// watch(() => productBatchStore.totalBatches, (newValue) => {
//     if (newValue) {
//         productBatchStore.fetchListProductBatch();
//     }
// }, { deep: true });

const fetchListProductBatch = () => {
    productBatchStore.fetchListProductBatch();
};

onMounted(() => {
    productBatchStore.fetchListProductBatch();
});

const handleCurrentChange = (val) => {
    currentPage.value = val;
    console.log(`current page: ${val}`);
};
</script>

<style scoped>
:deep(.demo-tabs .el-tabs__header) {
    background-color: #333 !important;
    color: white;
}

:deep(.demo-tabs .el-tabs__header .el-tabs__item) {
    color: white;
    /* Màu mặc định của tiêu đề */
}

:deep(.demo-tabs .el-tabs__header .is-active) {
    color: black;
    /* Màu khi click */
}

:deep(.el-transfer .el-transfer-panel) {
    width: 20% !important;
    border: 1px solid #6b778c !important;
}

:deep(.el-transfer__buttons button) {
    background-color: black !important;
}

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

.border-none {
    border: none;
}
</style>