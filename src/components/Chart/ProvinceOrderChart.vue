<template>
    <div class="chart-container" style="position: relative; height:600px; width:100%">
        <h6>{{ chartTitle }}</h6>
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
    provinceData: {
        type: Array,
        required: true
    },
    chartTitle: {
        type: String,
        default: 'Số lượng đơn hàng theo tỉnh'
    }
})

const chartData = computed(() => ({
    labels: props.provinceData.map(item => item.province),
    datasets: [{
        label: 'Số đơn hàng',
        data: props.provinceData.map(item => item.orders),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
}))

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Để tạo biểu đồ ngang
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: props.chartTitle
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Số đơn hàng'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Tỉnh/Thành phố'
            }
        }
    }
}))

</script>

<style scoped>
.chart-container {
    margin: 20px auto;
}
</style>