<template>
    <div class="card-body">
        <div class="form-group pull-right contain-search">
        </div>

        <table class="table table-hover table-bordered results">
            <thead>
                <tr>
                    <th class="col text-center">STT</th>
                    <th class="col text-center">Mã yêu cầu</th>
                    <th class="col text-center">Khách hàng</th>
                    <th class="col text-center">Tên ngân hàng</th>
                    <th class="col text-center">STK</th>
                    <th class="col text-center">Tên chủ tài khoản</th>
                    <th class="col text-center">Trạng thái</th>
                    <th class="col text-center">Ngày tạo</th>
                    <th class="col text-center"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in pagigationData" :key="item.withdrawal_id">
                    <th scope=" row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center">
                        {{ item.withdrawal_id }}
                    </td>
                    <td class="text-center">
                        {{ item.affiliate_user.name }}
                    </td>

                    <td class="text-center">
                        {{ item.bank_name }}
                    </td>
                    <td class="text-center">
                        {{ item.account_number }}
                    </td>
                    <td class="text-center">
                        {{ item.account_holder_name }}
                    </td>
                    <td class="text-center">
                        <span class="text-primary" v-if="item.status === 'pending'">Đang xử lý</span>
                        <span class="text-success" v-if="item.status === 'done'">Đã chuyển</span>
                    </td>
                    <td class="text-center">
                        {{ convertTime(item.created_at) }}
                    </td>
                    <td class="text-center">
                        <el-button :disabled="item.status == 'done'" @click="handleDone(item.withdrawal_id)"
                            type="primary" plain>Đã
                            chuyển</el-button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(withDrawalData.length / pageSize) * 10" class="mt-4" />
        </div>
        <div v-show="withDrawalData.length === 0">
            <p class="text-center">Không có yêu cầu nào</p>
        </div>
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
const withDrawalData = ref([]);
const echoInstance = initializeEcho();

echoInstance.channel('affiliate-withdrawal')
    .listen('.request-withdrawal', async (event) => {
        fetchWithdrawal();
    });
const fetchWithdrawal = async () => {
    try {
        const response = await affiliateService.getWithdraw();
        withDrawalData.value = response.data;
        console.log('withDrawalData', withDrawalData.value);
    } catch (error) {
        console.log(error.response);
    }
}

const handleDone = async (id) => {
    try {
        const response = await affiliateService.done(id);
        showSuccess('Đã cập nhật trạng thái');
        fetchWithdrawal();
    } catch (error) {
        console.log(error.response);
    }
}
onMounted(() => {
    fetchWithdrawal();
});

const pagigationData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return withDrawalData.value.slice(startIndex, endIndex);

});
const handleCurrentChange = (val) => {
    currentPage.value = val;
}

</script>