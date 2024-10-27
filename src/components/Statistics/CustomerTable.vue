<template>
    <div class="card mb-4">
        <el-row class="mx-2">
            <el-col :span="6">
                <el-row><span class="design-font">Tổng số khách hàng: {{ totalUser }}</span></el-row>
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
                <span class="ms-2" style="font-size: 14px">Kết quả: {{ dataSearch.length }} </span>
            </div>
            <span class="counter pull-right"></span>
            <table class="table table-hover table-bordered results">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th class="col">Tên khách hàng</th>
                        <th class="col">Email</th>
                        <th class="col">Điểm tích lũy</th>
                        <th class="col">Điểm đã dùng</th>
                        <th class="col">Tổng đơn hàng
                            <button @click="sortByOrderCount" class="border-none">
                                <i class="fa-solid fa-sort"></i>
                            </button>
                        </th>
                        <th class="col">
                            Tổng tiền đã mua
                            <button @click="sortByBuyingMoney" class="border-none">
                                <i class="fa-solid fa-sort"></i>
                            </button>
                        </th>
                        <th>Thời gian tham gia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in dataSearch" :key="user.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.point }}</td>
                        <td>{{ user.point_used }}</td>
                        <td>
                            {{ user.order_count }}
                        </td>
                        <td>
                            {{ formatCurrency(parseInt(user.order_sum_total_cost ?? 0)) }}
                        </td>

                        <td>{{ convertTime(user.created_at) }}</td>
                    </tr>
                    <tr v-show="dataSearch.length == 0" class="text-center text-danger" height="50">
                        <td colspan="7">
                            <div class="text-center">Không tìm thấy !!!</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="text-end mb-2">
                <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" size="small"
                    background layout="prev, pager, next" :total="Math.ceil(listCustomerLength / pageSize) * 10"
                    class="mt-4" />
            </div>
        </el-row>
    </div>
    <div> <el-date-picker v-model="yearSelect" type="year" placeholder="Chọn năm" /><el-button
            @click="sortByYear">Lọc</el-button></div>
    <div class="card mb-4">
        <ProvinceOrderChart :provinceData="provinceData" chartTitle="Số lượng đơn hàng theo tỉnh năm 2023" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import statisticService from '../../services/statistic.service';
import { convertTime, formatCurrency } from '@/helpers/UtilHelper';
import ProvinceOrderChart from '../Chart/ProvinceOrderChart.vue';

const dateSelect = ref(null);
const currentPage = ref(1);
const pageSize = 8;
const startDateFilter = ref('');
const endDateFilter = ref('');
const search = ref('');
const listCustomer = ref([]);
const listCustomerLength = ref(0);
const totalUser = ref(0);
const yearSelect = ref(new Date(2024, 0, 1));
const provinceData = ref([
])

const sortByDate = () => {
    if (dateSelect.value !== null) {
        const { startDate, endDate } = getDateRange();
        console.log(`Start Date: ${startDate}\nEnd Date: ${endDate}`);
        startDateFilter.value = startDate;
        endDateFilter.value = endDate;
        filterUser({
            start_date: startDateFilter.value,
            end_date: endDateFilter.value,
        });
    } else {
    }
};

const filterUser = async (data = {}) => {
    try {
        const response = await statisticService.filterUser(data);
        listCustomer.value = response.data;
        listCustomerLength.value = response.data.length;
        totalUser.value = response.data.length;
        console.log("FILTER: ", response);
    } catch (error) {
        console.log(error.response);
    }
};

const getUserProvince = async (data = {}) => {
    try {
        const response = await statisticService.statisticUserProvince(data);
        console.log('Province: ', response);
        provinceData.value = [];
        for (const [province, orders] of Object.entries(response.data)) {
            provinceData.value.push({
                province,
                orders
            });
        }
    } catch (error) {
        console.log(error.response);
    }
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

const sortByYear = () => {
    if (yearSelect.value !== null) {
        const selectedYear = yearSelect.value.getFullYear();
        getUserProvince({ year: selectedYear });
    } else {
        getUserProvince({});
    }
};

onMounted(async () => {
    filterUser();
    getUserProvince();
});

const dataSearch = computed(() => {
    const searchKey = String(search.value).trim();
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (!search.value) {
        return listCustomer.value.slice(startIndex, endIndex);
    }
    return listCustomer.value.filter((data) => {
        return String(data.name).toLowerCase().includes(searchKey.toLowerCase());
    })
});

const sortUserPoint = ref("ascending");

const sortByBuyingMoney = () => {
    const sorting = sortUserPoint.value === 'ascending' ? 1 : -1;
    if (sortUserPoint.value === 'ascending') {
        sortUserPoint.value = 'descending';
    } else {
        sortUserPoint.value = 'ascending';
    }
    listCustomer.value.sort((a, b) => (a.order_sum_total_cost - b.order_sum_total_cost) * sorting);
};

const sortByOrderCount = () => {
    const sorting = sortUserPoint.value === 'ascending' ? 1 : -1;
    if (sortUserPoint.value === 'ascending') {
        sortUserPoint.value = 'descending';
    } else {
        sortUserPoint.value = 'ascending';
    }
    listCustomer.value.sort((a, b) => (a.order_count - b.order_count) * sorting);
};

const handleCurrentChange = (val) => {
    currentPage.value = val;
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