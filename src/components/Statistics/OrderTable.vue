<template>
    <div class="card mb-4">
        <el-row class="mx-2">
            <el-col :span="4">
                <el-row><span class="design-font">Tổng đơn hàng đã giao thành công: {{ listOrderLength
                        }}</span></el-row>
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
                <span class="ms-2" style="font-size: 14px">Kết quả: {{ listOrderLength }}</span>
            </div>
            <span class="counter pull-right"></span>
            <table class="table table-hover table-bordered results">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th class="col">Mã đơn hàng</th>
                        <th class="col">Trạng thái</th>
                        <th class="col">Phí giao hàng</th>
                        <th class="col">
                            Tổng tiền
                            <button class="border-none">
                                <i class="fa-solid fa-sort"></i>
                            </button>
                        </th>
                        <th class="col">Ngày đặt hàng</th>
                        <th class="col">Xem chi tiết</th>
                        <!-- <th class="col">
                      Tổng tiền đã mua
                      <button class="border-none" @click="toggleSortOrder">
                        <i class="fa-solid fa-sort"></i>
                      </button>
                    </th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in dataSearch" :key="order.order_id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>#{{ order.bill_id }}</td>
                        <td>
                            <span class="badge rounded-pill text-success font-size-11 task-status">Đã giao</span>
                        </td>
                        <td>{{ formatCurrency(order.shipping_fee) }}</td>
                        <td>
                            {{ formatCurrency(order.total_cost - order.shipping_fee) }}
                        </td>
                        <td>
                            {{ convertTime(order.created_at) }}
                        </td>
                        <td>
                            <router-link :to="{
                                name: 'order-detail',
                                params: { id: order.order_id },
                            }">Xem chi tiết</router-link>
                        </td>
                    </tr>
                    <!-- <tr v-show="sortedOrders.length == 0" class="text-center text-danger" height="50">
                        <td colspan="7">
                            <div class="text-center">Không tìm thấy !!!</div>
                        </td>
                    </tr> -->
                </tbody>
            </table>
            <div class="text-end mb-2">
                <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" size="small"
                    background layout="prev, pager, next" :total="Math.ceil(listOrderLength / pageSize) * 10"
                    class="mt-4" />
            </div>
        </el-row>
    </div>
    <div> <el-date-picker v-model="yearSelect" type="year" placeholder="Chọn năm" /><el-button
            @click="sortByYear">Lọc</el-button></div>
    <div class="card mb-4">
        <BarChart :chart-data="chartDataComputed" :chart-options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import statisticService from '../../services/statistic.service';
import BarChart from '../Chart/BarChart.vue';
import { convertTime, formatCurrency } from '@/helpers/UtilHelper';

const dateSelect = ref(null);
const yearSelect = ref(new Date(2024, 0, 1));
const currentPage = ref(1);
const pageSize = 8;
const startDateFilter = ref('');
const endDateFilter = ref('');
const search = ref('');
const listOrder = ref([]);
const listOrderLength = ref(0);
const monthlyRevenueData = ref([]);
const statisticOrder = async () => {
    try {
        const response = await statisticService.statisticOrder();
        listOrder.value = response.data;
        listOrderLength.value = response.data.length;
        console.log("List order: ", response);
    } catch (error) {
        console.log(error.response);
    }
};

const sortByDate = () => {
    if (dateSelect.value !== null) {
        const { startDate, endDate } = getDateRange();
        console.log(`Start Date: ${startDate}\nEnd Date: ${endDate}`);
        startDateFilter.value = startDate;
        endDateFilter.value = endDate;
        statisticOrder({
            start_date: startDateFilter.value,
            end_date: endDateFilter.value,
        });
    } else {
    }
};

const getMonthlyRevenue = async (data = {}) => {
    try {
        const response = await statisticService.monthlyRevenue(data);
        console.log("Monthly revenue: ", response);
        const revenueData = response.data.map(item => item.revenue);
        monthlyRevenueData.value = revenueData;
    } catch (error) {
        console.log(error.response);
    }
}

const sortByYear = () => {
    if (yearSelect.value !== null) {
        const selectedYear = yearSelect.value.getFullYear();
        getMonthlyRevenue({ year: selectedYear });
    } else {
        getMonthlyRevenue({});
    }
}

onMounted(() => {
    statisticOrder();
    getMonthlyRevenue();
});

const dataSearch = computed(() => {
    const searchKey = String(search.value).trim();
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (!search.value) {
        return listOrder.value.slice(startIndex, endIndex);
    }
    return listOrder.value.filter((data) => {
        return String(data.bill_id).toLowerCase().includes(searchKey.toLowerCase());
    })
});

const handleCurrentChange = (val) => {
    currentPage.value = val;
};

// Chart handle
const chartDataComputed = computed(() => ({
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
        {
            label: 'Tổng tiền bán',
            backgroundColor: '#333',
            data: monthlyRevenueData.value,
        }
    ]
}));


const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            display: true
        },
        title: {
            display: true,
            text: 'Thống kê số tiền bán hàng theo tháng'
        },
        datalabels: {
            display: true
        }
    }
});
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