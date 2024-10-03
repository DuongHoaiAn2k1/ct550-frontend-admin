<template>
    <div class="card mb-4">
        <el-row class="mx-2">
            <el-col :span="6">
                <el-row><span class="design-font">Tổng số sản phẩm: {{ listProductLength }}</span></el-row>
                <el-row><span class="design-content"></span></el-row>
            </el-col>
        </el-row>

        <el-row class="mx-2 mt-3">
            <div class="form-group pull-right contain-search">
                <input v-model="search" type="text" class="search form-control form-design"
                    placeholder="Nhập từ khóa tìm kiếm" />
                <el-date-picker v-model="dateSelect" type="daterange" range-separator="Đến"
                    start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" size="default" />

                <el-button @click="sortByDate">Lọc</el-button>
                <span class="ms-2" style="font-size: 14px">Kết quả: {{ dataSearch.length }}</span>
            </div>
            <span class="counter pull-right"></span>
            <table class="table table-hover table-bordered results">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th class="col">Tên sản phẩm</th>
                        <th class="col">Số lượng bán ra</th>
                        <th class="col">Số lượt xem(All)</th>
                        <th class="col">
                            Tổng số tiền thu được
                            <button class="border-none">
                                <i class="fa-solid fa-sort"></i>
                            </button>
                        </th>
                        <!-- <th class="col">
                      Tổng tiền đã mua
                      <button class="border-none" @click="toggleSortOrder">
                        <i class="fa-solid fa-sort"></i>
                      </button>
                    </th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product, index) in dataSearch" :key="product.product_id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ product.product_name }}</td>
                        <td>{{ product.total_quantity }}</td>
                        <td>
                            {{ product.product_views }}
                        </td>
                        <td>
                            {{ formatCurrency(parseInt(product.total_cost_detail)) }}
                        </td>
                    </tr>
                    <!-- <tr v-show="sortedProducts.length == 0" class="text-center text-danger" height="50">
                        <td colspan="7">
                            <div class="text-center">Không tìm thấy !!!</div>
                        </td>
                    </tr> -->
                </tbody>
            </table>
            <div class="text-end mb-2">
                <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" size="small"
                    background layout="prev, pager, next" :total="Math.ceil(listProductLength / pageSize) * 10"
                    class="mt-4" />
            </div>
        </el-row>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import statisticService from '../../services/statistic.service';
import { formatCurrency } from '../../helpers/UtilHelper';

const search = ref("");
const currentPage = ref(1);
const pageSize = 8;
const listProduct = ref([]);
const listProductLength = ref(0);
const dateSelect = ref('');
const startDateFilter = ref('');
const endDateFilter = ref('');
const statisticProduct = async (data = {}) => {
    try {
        const response = await statisticService.statisticProduct(data);
        listProduct.value = response.data;
        listProductLength.value = response.data.length;
        console.log('Statistic Product: ', response);
    } catch (error) {
        console.log(error.response);
    }
}

const sortByDate = () => {
    if (dateSelect.value !== null) {
        const { startDate, endDate } = getDateRange();
        console.log(`Start Date: ${startDate}\nEnd Date: ${endDate}`);
        startDateFilter.value = startDate;
        endDateFilter.value = endDate;
        statisticProduct({
            start_date: startDateFilter.value,
            end_date: endDateFilter.value,
        });
    } else {
        statisticProduct();
    }
}

onMounted(() => {
    statisticProduct();
})

const dataSearch = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const searchKey = String(search.value).trim();
    if (!search) {
        return listProduct.value?.slice(startIndex, endIndex);
    } else {
        return listProduct.value?.filter(item => item.product_name.toLowerCase().includes(searchKey.toLowerCase())).slice(startIndex, endIndex);
    }
})

const handleCurrentChange = (val) => {
    currentPage.value = val
}

const getDateRange = () => {
    const dateString = dateSelect.value.toString();
    const commaIndex = dateString.indexOf(",");
    const startDateString = dateString.slice(0, commaIndex).trim();
    const endDateString = dateString.slice(commaIndex + 1).trim();

    // Parse the dates from input string
    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);
    // Adjust times
    startDate.setHours(0, 0, 0, 0); // Set start date to 00:00:00
    endDate.setHours(23, 59, 59, 999); // Set end date to 23:59:59

    // Convert to ISO string and adjust for timezone offset
    const offsetStart = startDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const offsetEnd = endDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const isoStartDate = new Date(
        startDate.getTime() - offsetStart
    ).toISOString();
    const isoEndDate = new Date(endDate.getTime() - offsetEnd).toISOString();

    return {
        startDate: isoStartDate,
        endDate: isoEndDate,
    };
};
</script>

<style scoped>
:deep(.el-pagination .el-pager .is-active) {
    background-color: black !important;
}

.form-design {
    width: 220px;

}
</style>