<template>
    <div class="card-body">
        <div class="form-group pull-right contain-search">
        </div>
        <el-date-picker v-model="dateSelect" class="ms-3" type="daterange" range-separator="Đến"
            start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" />
        <el-button @click="sortByDate">Lọc</el-button>
        <span class="ms-2" style="font-size: 14px">Kết quả: {{ listAffiliateOrderSale.length }}</span>
        <table class="table table-hover table-bordered results">
            <thead>
                <tr>
                    <th class="col text-center">STT</th>
                    <th class="col text-center">Mã đơn hàng</th>
                    <th class="col text-center">Sản phẩm</th>
                    <th class="col text-center">Số lượng</th>
                    <th class="col text-center">Mức hoa hồng</th>
                    <th class="col text-center">Hoa hồng nhận</th>
                    <th class="col text-center">Người tiếp thị</th>
                    <th class="col text-center">Ngày tạo</th>
                    <th class="col text-center"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in pagigationData" :key="item.affiliate_sale_id">
                    <th scope=" row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center">
                        {{ item.order.bill_id }}
                    </td>
                    <td class="text-center">
                        {{ item.product.product_name }}
                    </td>

                    <td class="text-center">
                        {{ getQuantity(item.order.order_detail, item.product_id) }}
                    </td>

                    <td class="text-center">
                        {{ Math.floor(item.commission_rate) }}%
                    </td>
                    <td class="text-center">
                        {{ formatCurrency(item.commission_amount) }}
                    </td>
                    <td class="text-center">
                        {{ item.affiliate_user.name }}
                    </td>
                    <td class="text-center">
                        {{ convertTime(item.order.created_at) }}
                    </td>
                    <td class="text-center">
                        <router-link :to="{ name: 'order-detail', params: { id: item.order.order_id } }">Xem
                            chi tiết</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(listAffiliateOrderSale.length / pageSize) * 10"
                class="mt-4" />
        </div>
        <!-- <div v-show="withDrawalData.length === 0">
            <p class="text-center">Không có yêu cầu nào</p>
        </div> -->
    </div>


</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import affiliateService from '../../services/affiliate.service';
import { convertTime, formatCurrency } from '../../helpers/UtilHelper';
import { showSuccess } from '../../helpers/NotificationHelper';
import { initializeEcho } from "../../pusher/echoConfig";

const currentPage = ref(1);
const pageSize = 8;
const listAffiliateOrderSale = ref([]);
const originData = ref([]);
const echoInstance = initializeEcho();
const dateSelect = ref(null);
const startDateFilter = ref(new Date());
const endDateFilter = ref(new Date());

const getListAffiliateOrderSale = async () => {
    try {
        const response = await affiliateService.getListAffiliateOrderSale();
        listAffiliateOrderSale.value = response.data;
        originData.value = response.data;
        console.log('listAffiliateOrderSale', listAffiliateOrderSale.value);
        return response.data
    } catch (error) {
        console.log(error.response);
        throw error;
    }
}

const getQuantity = (data, id) => {
    return data.find(item => item.product_id === id).quantity;
}

const sortByDate = () => {
    if (dateSelect.value !== null) {
        // console.log("Date select: ", dateSelect.value[0], dateSelect.value[1]);
        startDateFilter.value = dateSelect.value[0];
        endDateFilter.value = dateSelect.value[1];
        console.log(`Start Date: ${startDateFilter.value}\nEnd Date: ${endDateFilter.value}`);
        listAffiliateOrderSale.value = originData.value;
        listAffiliateOrderSale.value = listAffiliateOrderSale.value.filter(item => {
            const orderDate = new Date(item.order.created_at);
            return orderDate >= startDateFilter.value && orderDate <= endDateFilter.value;
        });
    } else {
        listAffiliateOrderSale.value = originData.value;
    }
};

onMounted(() => {
    getListAffiliateOrderSale();
});

const pagigationData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return listAffiliateOrderSale.value.slice(startIndex, endIndex);

});
const handleCurrentChange = (val) => {
    currentPage.value = val;
}

</script>