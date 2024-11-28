<template>
    <el-date-picker v-model="dateData" type="month" placeholder="Chọn tháng" />
    <el-button @click="sortByDate">Lọc</el-button> <span class="ms-2" style="font-size: 14px">Tổng đơn hàng:
        {{ totalOrders }} </span>
    <canvas id="myChart"></canvas>
</template>

<script setup>
import { ref } from "vue";
import { Chart, registerables } from "chart.js";
import affiliateService from "../../services/affiliate.service";

Chart.register(...registerables);

const dateData = ref("");
const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());
const totalOrders = ref(0);
const totalRevenue = ref(0);
const totalCommission = ref(0);
const totalWithdrawal = ref(0);
let myChart = null;

const createChart = () => {
    const ctx = document.getElementById("myChart").getContext("2d");

    if (myChart) {
        // Xóa biểu đồ cũ trước khi tạo lại
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Doanh thu (VND)", "Hoa hồng (VND)", "Tổng tiền đã chuyển (VND)"],
            datasets: [
                {
                    label: `Thống kê tháng ${month.value}`,
                    data: [totalRevenue.value, totalCommission.value, totalWithdrawal.value],
                    backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
                },
            ],
        },
        options: {
            responsive: true,
            indexAxis: "y",
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            return `${context.label}: ${value.toLocaleString()} đ`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                },
            },
        },
    });
};

const calculateAffiliateStatistics = async (month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
    try {
        const response = await affiliateService.calculateAffiliateStatistics({
            month: month,
            year: year
        });

        totalRevenue.value = isNaN(Number(response.total_revenue)) ? 0 : Number(response.total_revenue);
        totalCommission.value = isNaN(Number(response.total_commission)) ? 0 : Number(response.total_commission);
        totalWithdrawal.value = isNaN(Number(response.total_withdrawals)) ? 0 : Number(response.total_withdrawals);
        totalOrders.value = response.total_orders;

        createChart();
    } catch (error) {
        console.error("Error fetching statistics:", error);
    }
};

const sortByDate = () => {
    if (dateData.value !== "") {
        month.value = dateData.value.getMonth() + 1;
        year.value = dateData.value.getFullYear();
        calculateAffiliateStatistics(month.value, year.value);
    }
};

calculateAffiliateStatistics(month.value, year.value); // Gọi khi component được mounted
</script>
