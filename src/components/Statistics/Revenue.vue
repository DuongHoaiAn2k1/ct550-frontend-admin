<template>
    <div class="card mb-4">
        <div class="row mx-1 mb-2">
            <span style="font-size: 24px">Thống kê theo tháng</span>
        </div>

        <el-row class="mx-2 mt-3">
            <div class="form-group pull-right contain-search">
                <el-date-picker v-model="monthSelect" type="month" placeholder="Pick a month" />
                <el-button @click="sortByMonth">Lọc</el-button>
            </div>
            <span class="counter pull-right"></span>
        </el-row>
        <el-row class="ms-10 my-5">
            <!-- <el-col :span="8">
                <el-row><span class="design-font ms-5">Tổng tiền thu</span></el-row>
                <el-row><span class="design-content"></span></el-row>
            </el-col> -->
            <el-col :span="8">
                <el-row><span class="design-font ms-5">Tổng tiền bán hàng</span></el-row>
                <el-row><span class="design-content">{{ formatCurrency(parseInt(totalSale)) }}</span></el-row>
            </el-col>
            <el-col :span="8">
                <el-row><span class="design-font ms-5">Tổng lợi nhuận</span></el-row>
                <el-row><span class="design-content">{{ formatCurrency(totalProfit) }}</span></el-row>
            </el-col>
        </el-row>

        <div class="row mx-1 mb-2">
            <span style="font-size: 24px">Thống kê theo năm</span>
        </div>

        <el-row class="mx-2 mt-3">
            <div class="form-group pull-right contain-search">
                <el-date-picker v-model="yearSelect" type="year" placeholder="Pick a year" />
                <el-button @click="sortByYear">Lọc</el-button>
            </div>
            <span class="counter pull-right"></span>
        </el-row>
        <el-row class="ms-10 my-5">
            <!-- <el-col :span="8">
                <el-row><span class="design-font ms-5">Tổng tiền thu</span></el-row>
                <el-row><span class="design-content"></span></el-row>
            </el-col> -->
            <el-col :span="8">
                <el-row><span class="design-font ms-5">Tổng tiền bán hàng</span></el-row>
                <el-row><span class="design-content">{{ formatCurrency(parseInt(totalSaleYear)) }}</span></el-row>
            </el-col>
            <el-col :span="8">
                <el-row><span class="design-font ms-5">Tổng lợi nhuận</span></el-row>
                <el-row><span class="design-content">{{ formatCurrency(totalProfitYear) }}</span></el-row>
            </el-col>
        </el-row>


    </div>
    <div class="form-group pull-right contain-search">
        <el-date-picker v-model="yearProfitSelect" type="year" placeholder="Pick a year" />
        <el-button @click="sortProfitByYear">Lọc</el-button>
    </div>
    <div class="card mb-4">

        <BarChart :chart-data="chartDataComputed" :chart-options="chartOptions" />
    </div>
</template>


<script setup>

import { onMounted, ref, computed } from 'vue';
import statisticService from '../../services/statistic.service';
import { formatCurrency } from '../../helpers/UtilHelper';
import BarChart from '../Chart/BarChart.vue';
const monthSelect = ref(new Date(2024, 10, 1));
const totalSale = ref(0);
const totalProfit = ref(0);
const yearSelect = ref(new Date(2024, 0, 1));

const totalProfitYear = ref(0);
const totalSaleYear = ref(0);
const yearProfitSelect = ref(new Date(2024, 0, 1));
const monthlyRevenueData = ref([]);
const sortByMonth = async () => {
    // console.log(monthSelect.value.getMonth());
    // console.log(monthSelect.value.getFullYear());
    try {
        const response = await statisticService.totalSaleByMonth({
            month: monthSelect.value.getMonth() + 1,
            year: monthSelect.value.getFullYear()
        });
        totalSale.value = response.total_sales;
        const result = await statisticService.totalProfitByMonth({
            month: monthSelect.value.getMonth() + 1,
            year: monthSelect.value.getFullYear()
        });
        totalProfit.value = result.total_profit;

        console.log(response);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

const sortByYear = async () => {
    try {
        const response = await statisticService.totalSaleByYear({
            year: yearSelect.value.getFullYear()
        });
        totalSaleYear.value = response.total_sales;
        const result = await statisticService.totalProfitByYear({
            year: yearSelect.value.getFullYear()
        });
        totalProfitYear.value = result.total_profit;
    } catch (error) {
        console.log(error);
    }
}

const profitByMonth = async (data = {}) => {
    try {
        const response = await statisticService.profitByMonth(data);
        console.log("profitByMonth: ", response);

        monthlyRevenueData.value = [];
        for (let i = 1; i <= 12; i++) {
            monthlyRevenueData.value.push(response.data[i.toString()] || 0);
        }
    } catch (error) {
        console.log(error.response)
    }
}

onMounted(async () => {
    const response1 = await statisticService.totalSaleByMonth({
    });
    totalSale.value = response1.total_sales;
    const response2 = await statisticService.totalProfitByMonth({
    });
    totalProfit.value = response2.total_profit;

    const response3 = await statisticService.totalSaleByYear({
    });
    totalSaleYear.value = response3.total_sales;
    const response4 = await statisticService.totalProfitByYear({
    });
    totalProfitYear.value = response4.total_profit;

    profitByMonth();
});

const sortProfitByYear = () => {

    profitByMonth({
        year: yearProfitSelect.value.getFullYear()
    })

}

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
            text: 'Thống kê lợi nhuận theo tháng'
        },
        datalabels: {
            display: true
        }
    }
});
</script>

<style scoped>
.design-font {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 600;
}

.design-content {
    margin-left: 40px;
    margin-top: 4px;
    font-size: 28px;
}
</style>