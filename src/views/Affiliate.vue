<template>
    <div id="layoutSidenav_content">
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">QUẢN LÝ TIẾP THỊ</h1>
                <!-- Modal -->

                <div class="card mb-4">
                    <el-tabs type="border-card" class="demo-tabs">
                        <el-tab-pane label="Danh sách yêu cầu">
                            <div class="card-body">
                                <div class="form-group pull-right contain-search">
                                    <input type="text" class="search form-control form-design"
                                        placeholder="Nhập từ khóa tìm kiếm" v-model="search" />
                                </div>

                                <table class="table table-hover table-bordered results">
                                    <thead>
                                        <tr>
                                            <th class="col text-center">STT</th>
                                            <th class="col text-center">Tên khách hàng</th>
                                            <th class="col text-center">Email</th>
                                            <th class="col text-center">Link mạng xã hội</th>
                                            <th class="col text-center">SĐT</th>
                                            <th class="col text-center">Ngày tham gia</th>
                                            <th class="col text-center">Trạng thái</th>
                                            <th class="col text-center"></th>
                                            <th class="col text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in datasearch">
                                            <th scope="row" class="text-center">{{ index + 1 }}</th>
                                            <td class="text-center">{{ item.user.name }}
                                            </td>

                                            <td class="text-center">
                                                {{ item.user.email }}
                                            </td>

                                            <td class="text-center">
                                                <a :href="item.social_media_link" target="_blank">{{
                                                    item.social_media_link }}</a>
                                            </td>

                                            <td class=" text-center">
                                                {{ item.user.phone }}
                                            </td>
                                            <td class="text-center">
                                                {{ convertTime(item.user.created_at) }}
                                            </td>
                                            <td class="text-center">
                                                {{ status[item.status] }}
                                            </td>
                                            <td class="text-center">
                                                <el-button type="success"
                                                    :disabled="item.status == 'approved' || item.status == 'rejected'"
                                                    @click="handleApproved(item.affiliate_request_id)">Xét
                                                    duyệt</el-button>
                                            </td>
                                            <td class="text-center">
                                                <el-button type="danger"
                                                    :disabled="item.status == 'approved' || item.status == 'rejected'"
                                                    @click="showFormReject(item.affiliate_request_id)">Từ
                                                    chối</el-button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="text-end">
                                    <el-pagination v-model:current-page="currentPage"
                                        @current-change="handleCurrentChange" small background
                                        layout="prev, pager, next"
                                        :total="Math.ceil(listRequest.length / pageSize) * 10" class="mt-4" />
                                </div>
                                <div v-show="datasearch.length === 0">
                                    <p class="text-center">Không có yêu cầu nào</p>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="Danh sách nhà tiếp thị">
                            <AffiliateTable />
                        </el-tab-pane>
                        <el-tab-pane label="Hoa hồng cho sản phẩm">
                            <CommissionTable />
                        </el-tab-pane>
                        <el-tab-pane label="Yêu cầu rút tiền">
                            <WithdrawalTable />
                        </el-tab-pane>
                    </el-tabs>


                </div>
            </div>
        </main>
    </div>
    <el-dialog v-model="showRejectForm" title="Lý do từ chối" width="600" center>
        <textarea name="" id="" cols="70" rows="10" placeholder="Nhập lý do từ chối" v-model="reason"></textarea>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showRejectForm = false">Hủy</el-button>
                <el-button type="danger" @click="handleReject">
                    Từ chối
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, onMounted, computed, watch, handleError } from 'vue'
import affiliateService from '../services/affiliate.service';
import { initializeEcho } from '../pusher/echoConfig';
import { convertTime } from '../helpers/UtilHelper'
import CommissionTable from '../components/Tables/CommissionTable.vue';
import AffiliateTable from '../components/Tables/AffiliateTable.vue';
import WithdrawalTable from '../components/Tables/WithdrawalTable.vue';
import { showSuccess } from '../helpers/NotificationHelper';
import { showLoading } from '../helpers/LoadingHelper';

const search = ref('');
const listRequest = ref([]);
const echoInstance = initializeEcho();
const showRejectForm = ref(false);
const currentPage = ref(1);
const pageSize = 8;


echoInstance.channel(`affiliate-create-request`).listen('.affiliate-create-request', async (event) => {
    fetchListRequest();
});


const status = {
    pending: 'Đang chờ',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
}

const affiliateRequestIdSelected = ref('');
const reason = ref('');

const fetchListRequest = async () => {
    try {
        const response = await affiliateService.getAll();
        console.log("List request: ", response);
        listRequest.value = response.data;
    } catch (error) {

    }
}

const handleApproved = async (id) => {
    try {
        const response = await affiliateService.approved(id);
        fetchListRequest();
        console.log("Approved: ", response);
    } catch (error) {
        console.log(error.response);
    }
}

const showFormReject = (id) => {
    affiliateRequestIdSelected.value = id;
    showRejectForm.value = true;
}

const handleReject = async () => {
    try {
        const loading = showLoading();
        const response = await affiliateService.rejected(affiliateRequestIdSelected.value, {
            reason: reason.value
        });
        setTimeout(() => {
            fetchListRequest();
            showRejectForm.value = false;
            showSuccess("Đã từ chối yêu cầu");
            console.log("Reject: ", response);
            loading.close();
        }, 2000);

    } catch (error) {
        console.log(error.response);
    }
}

const datasearch = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (!search.value) {
        return listRequest.value.slice(startIndex, endIndex);
    }
    return listRequest.value.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase())).slice(startIndex, endIndex);
})



watch(search.value, (newData) => {
    if (newData) {
        console.log(datasearch.value);
    }
})

onMounted(() => {
    fetchListRequest();
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

.el-transfer-panel {
    width: 20% !important;
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.demo-tabs .custom-tabs-label .el-icon {
    vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
}

:deep(.el-pagination .el-pager .is-active) {
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
