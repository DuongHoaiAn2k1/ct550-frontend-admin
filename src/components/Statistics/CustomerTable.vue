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
                <el-select v-model="currentRoleSelect" placeholder="Chọn" style="width: 160px;" size="large">
                    <el-option label="Tất cả" value="" />
                    <el-option label="Khách hàng" value="normal_user" />
                    <el-option label="Khách hàng thân thiết" value="loyal_customer" />

                </el-select>
                <span class="ms-2" style="font-size: 14px">Kết quả: {{ dataSearch.length }} </span>
            </div>
            <span class="counter pull-right"></span>
            <table class="table table-hover table-bordered results">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th class="col">Tên khách hàng</th>
                        <th class="col">Email</th>
                        <th class="col">Vai trò</th>
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
                        <td>{{ user.role == 'normal_user' ? 'Khách hàng' : 'Khách hàng thân thiết' }}</td>
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
                        <td colspan="9">
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
    <div class="">
        <h1 class="mt-4">BXH Mua Hàng tháng {{ currentMonth }}</h1>
        <div class="card mb-4">
            <div class="card-body">
                <div class="form-group pull-right contain-search">
                    <el-date-picker v-model="monthSelect" type="month" placeholder="Chọn tháng" />
                    <!-- <span class="ms-2 mt-3" style="font-size: 16px">Kết quả: {{ search ? datasearch.length :
                        userStore.length
                        }}</span>  -->
                </div>
                <span class="counter pull-right"></span>
                <table class="table table-hover table-bordered results">
                    <thead>
                        <tr>
                            <th>Top</th>
                            <th class="col text-center">Tên khách hàng</th>
                            <th class="col">Email</th>
                            <th class="col">Vai trò</th>
                            <th class="col">Tổng tiền mua hàng</th>
                            <th class="col">Thời gian tham gia</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in panigationTopCustomer" :key="user.id">
                            <th scope="row" class="text-center">{{ index + 1 }} {{ index == 0 ? '🥇' : index == 1 ? '🥈'
                                : index == 2 ? '🥉' : '' }}
                            </th>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.role == 'normal_user' ? 'Khách hàng' : 'Khách hàng thân thiết' }}</td>
                            <td>{{ formatCurrency(parseInt(user.total_spent ?? 0)) }}</td>
                            <td>{{ convertTime(user.created_at) }}</td>
                            <td>
                                <el-button @click="showFormPointGiving(user.id, index + 1)">Tặng điểm</el-button>
                            </td>

                        </tr>
                    </tbody>
                </table>
                <div class="text-end">
                    <el-pagination v-model:current-page="currentTopCustomerPage"
                        @current-change="handleCurrentTopCustomerChange" small background layout="prev, pager, next"
                        :total="Math.ceil(topCustomers.length / pageSize) * 10" class="mt-4" />
                </div>
            </div>
        </div>
    </div>
    <div> <el-date-picker v-model="yearSelect" type="year" placeholder="Chọn năm" /><el-button
            @click="sortByYear">Lọc</el-button></div>
    <div class="card mb-4">
        <ProvinceOrderChart :provinceData="provinceData" chartTitle="Số lượng đơn hàng theo tỉnh năm 2023" />
    </div>


    <el-dialog v-model="showPointGiving" title="Tặng điểm người dùng" width="700" align-center>
        <div class="text-center">
            <el-input v-model="givingPointData.point" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showPointGiving = false">Hủy</el-button>
                <el-button type="dark" @click="handleGivingPoint">
                    Tặng
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import statisticService from '../../services/statistic.service';
import { convertTime, formatCurrency } from '@/helpers/UtilHelper';
import ProvinceOrderChart from '../Chart/ProvinceOrderChart.vue';
import userService from '../../services/user.service';
import { showSuccessMessage } from '../../helpers/NotificationHelper';
import { showLoading } from '../../helpers/LoadingHelper';

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
const provinceData = ref([]);
const topCustomers = ref([]);
const currentMonth = ref(new Date().getMonth() + 1);
const currentRoleSelect = ref('');
const monthSelect = ref(null);
const showPointGiving = ref(false);

const currentTopCustomerPage = ref(1);

const handleCurrentTopCustomerChange = (val) => {
    currentTopCustomerPage.value = val;
}

const panigationTopCustomer = computed(() => {
    const start = (currentTopCustomerPage.value - 1) * pageSize;
    const end = start + pageSize;
    return topCustomers.value.slice(start, end);
})
const fetchTopCustomers = async (month = currentMonth.value) => {
    try {
        const response = await userService.getTopCustomerByMonth({
            month: month,
        });
        topCustomers.value = response.data;
        console.log('Top Customers:', response.data);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

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
    fetchTopCustomers();
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

const givingPointData = ref({
    user_id: '',
    point: 0,
    rank: '',
    month: '',
})

const showFormPointGiving = (userId, rank) => {
    showPointGiving.value = true;
    givingPointData.value.user_id = userId;
    givingPointData.value.rank = rank;
    givingPointData.value.month = currentMonth.value;
}

const handleGivingPoint = async () => {
    try {
        const loading = showLoading();
        const response = await userService.givingPoint(givingPointData.value);
        console.log(response);
        setTimeout(() => {
            showSuccessMessage('Tặng điểm thành công');
            filterUser();
            showPointGiving.value = false;
            loading.close();
        }, 2000);
    } catch (error) {
        console.log(error.response);
        throw error;
    }
}

const handleCurrentChange = (val) => {
    currentPage.value = val;
};

watch(() => currentRoleSelect.value, (newRole) => {
    if (newRole != '') {
        listCustomer.value = listCustomer.value.filter((data) => {
            return data.role == newRole;
        });
    } else {
        filterUser();
    }
})

watch(() => monthSelect.value, (newDate) => {
    if (newDate != null) {
        fetchTopCustomers(newDate.getMonth() + 1);
        currentMonth.value = newDate.getMonth() + 1;
    } else {
        fetchTopCustomers();
        currentMonth.value = new Date().getMonth() + 1
    }
});
</script>



<style scoped>
:deep(.el-pagination .el-pager .is-active) {
    background-color: black !important;
}

.form-design {
    width: 220px;

}
</style>