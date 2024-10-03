<template>

    <div class="card-body">
        <div class="form-group pull-right contain-search">
            <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                v-model="userSearch" />
        </div>

        <table class="table table-hover table-bordered results">
            <thead>
                <tr>
                    <th class="col text-center">STT</th>
                    <th class="col text-center">Tên khách hàng</th>
                    <th class="col text-center">Email</th>
                    <th class="col text-center">SĐT</th>
                    <th class="col text-center">Ngày bắt đầu</th>
                    <th class="col text-center">Số dư</th>
                    <!-- <th class="col text-center">Trạng thái</th> -->
                    <!-- <th class="col text-center"></th> -->
                    <!-- <th class="col text-center"></th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in dataSearchAffiliate">
                    <th scope="row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center">{{ item.name }}
                    </td>

                    <td class="text-center">
                        {{ item.email }}
                    </td>
                    <td class="text-center">
                        {{ item.phone }}
                    </td>
                    <td class="text-center">
                        {{ convertTime(item.created_at) }}
                    </td>
                    <td class="text-center">
                        {{ formatCurrency(item.affiliate_wallets.balance) }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(listAffiliate.length / pageSize) * 10" class="mt-4" />
        </div>
        <div v-show="dataSearchAffiliate.length === 0">
            <p class="text-center">Không có sản phẩm nào</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { convertTime, formatCurrency } from '@/helpers/UtilHelper'
import userService from '@/services/user.service';

const userSearch = ref('');
const currentPage = ref(1);
const pageSize = 8;
const listAffiliate = ref([]);

const status = {
    pending: 'Đang chờ',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
}

const fetchListAffiliate = async () => {
    try {
        const response = await userService.getListAffiliate();
        console.log("List affiliate: ", response);
        listAffiliate.value = response.data;
    } catch (error) {
        console.log(error.response);
    }
}

const dataSearchAffiliate = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (!userSearch.value) {
        return listAffiliate.value.slice(startIndex, endIndex);
    }

    return listAffiliate.value.filter(item => item.name.toLowerCase().includes(userSearch.value.toLowerCase())).slice(startIndex, endIndex);
})

onMounted(() => {
    fetchListAffiliate();
});

const handleCurrentChange = (val) => {
    currentPage.value = val;
}
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