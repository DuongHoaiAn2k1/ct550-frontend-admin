<template>
    <div id="layoutSidenav_content">
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">DANH SÁCH YÊU CẦU HOÀN TIỀN</h1>

                <div class="card mb-4">
                    <div class="card-header">
                        <el-button @click="sortRefundShow('today')">Hôm nay</el-button>
                        <el-button @click="sortRefundShow('all')">Tất cả</el-button>
                        <el-date-picker class="ms-3" v-model="dateSelect" type="daterange" range-separator="Đến"
                            start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :size="size" />
                        <el-button @click="sortDate">Lọc</el-button>
                    </div>
                    <div class="card-body">
                        <div class="form-group pull-right contain-search"></div>
                        <span class="counter pull-right"></span>
                        <table class="table table-hover table-bordered results">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th class="col">Mã đơn hàng</th>
                                    <th class="col">Trạng thái</th>
                                    <th class="col">Thời gian tạo yêu cầu</th>
                                    <th class="col">Chi tiết đơn hàng</th>
                                    <th class="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-show="todayRefundShow" v-for="(data, index) in sortTodayRefundList"
                                    :key="data.refund_request_id">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>#{{ data.bill_id }}</td>
                                    <td><span v-show="data.refund_request_status == 'pending'"
                                            class="badge rounded-pill text-info font-size-11 task-status">Chưa xử
                                            lý</span>
                                        <span v-show="data.refund_request_status == 'processing'"
                                            class="badge rounded-pill orange font-size-11 task-status">Đang xử lý</span>
                                        <span v-show="data.refund_request_status == 'completed'"
                                            class="badge rounded-pill text-success font-size-11 task-status">Đã
                                            hoàn</span>

                                    </td>
                                    <td>{{ convertTime(data.created_at) }}</td>

                                    <td>
                                        <router-link :to="{
                                            name: 'order-detail',
                                            params: { id: data.order_id },
                                        }">Xem chi tiết</router-link>
                                    </td>
                                    <td class="text-center">
                                        <el-button type="primary" round
                                            @click="handleShowFormUpdate(data.refund_request_id, data.bill_id, data.refund_request_status)">Cập
                                            nhật</el-button>
                                    </td>
                                </tr>

                                <tr v-show="allRefundShow" v-for="(data, index) in refundListAll"
                                    :key="data.refund_request_id">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ data.bill_id }}</td>
                                    <td><span v-show="data.refund_request_status == 'pending'"
                                            class="badge rounded-pill text-info font-size-11 task-status">Chưa xử
                                            lý</span>
                                        <span v-show="data.refund_request_status == 'processing'"
                                            class="badge rounded-pill orange font-size-11 task-status">Đang xử lý</span>
                                        <span v-show="data.refund_request_status == 'completed'"
                                            class="badge rounded-pill text-success font-size-11 task-status">Đã
                                            hoàn</span>

                                    </td>
                                    <td>{{ convertTime(data.created_at) }}</td>

                                    <td>
                                        <router-link :to="{
                                            name: 'order-detail',
                                            params: { id: data.order_id },
                                        }">Xem chi tiết</router-link>
                                    </td>
                                    <td class="text-center">
                                        <el-button type="primary" round
                                            @click="handleShowFormUpdate(data.refund_request_id, data.bill_id, data.refund_request_status)">Cập
                                            nhật</el-button>
                                    </td>
                                </tr>
                                <tr v-show="byDateRefundShow" v-for="(data, index) in sortBydayRefundList"
                                    :key="data.refund_request_id">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>#{{ data.bill_id }}</td>
                                    <td><span v-show="data.refund_request_status == 'pending'"
                                            class="badge rounded-pill text-info font-size-11 task-status">Chưa xử
                                            lý</span>
                                        <span v-show="data.refund_request_status == 'processing'"
                                            class="badge rounded-pill orange font-size-11 task-status">Đang xử lý</span>
                                        <span v-show="data.refund_request_status == 'completed'"
                                            class="badge rounded-pill text-success font-size-11 task-status">Đã
                                            hoàn</span>

                                    </td>
                                    <td>{{ convertTime(data.created_at) }}</td>

                                    <td>
                                        <router-link :to="{
                                            name: 'order-detail',
                                            params: { id: data.order_id },
                                        }">Xem chi tiết</router-link>
                                    </td>
                                    <td class="text-center">
                                        <el-button type="primary" round
                                            @click="handleShowFormUpdate(data.refund_request_id, data.bill_id, data.refund_request_status)">Cập
                                            nhật</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <el-dialog v-model="isShowUpdateStatusForm" title="Cập nhật trạng thái" width="500"
                            destroy-on-close center>
                            <p style="font-weight: 600;">Cập nhật trạng thái hoàn tiền cho đơn hàng: {{ billIdSelected
                                }}</p>

                            <div>
                                <el-select v-model="statusSelected" placeholder="Chọn" style="width: 240px">
                                    <el-option label="---" value="" />
                                    <el-option label="Chưa xử lý" value="pending" />
                                    <el-option label="Đang xử lý" value="processing" />
                                    <el-option label="Hoàn tất" value="completed" />
                                </el-select>
                            </div>
                            <template #footer>
                                <div class="dialog-footer">
                                    <el-button @click="isShowUpdateStatusForm = false">Hủy</el-button>
                                    <el-button type="primary" @click="handleUpdateStatus">
                                        Cập nhật
                                    </el-button>
                                </div>
                            </template>
                        </el-dialog>
                        <div class="text-end">
                            <el-pagination v-show="todayRefundShow" v-model:current-page="currentPage"
                                @current-change="handleCurrentChange" small background layout="prev, pager, next"
                                :total="Math.ceil(todayRefundLength / pageSize) * 10" class="mt-4" />

                            <el-pagination v-show="allRefundShow" v-model:current-page="currentPage"
                                @current-change="handleCurrentChange" small background layout="prev, pager, next"
                                :total="Math.ceil(refundLength / pageSize) * 10" class="mt-4" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import refundService from "@/services/refund.service";
import { onMounted, ref, computed } from "vue";
import { convertTime, formatCurrency } from "@/helpers/UtilHelper";
import { showSuccess } from "@/helpers/NotificationHelper";
const currentPage = ref(1);
const listRefund = ref([]);
const pageSize = 8;
const refundLength = ref(0);
const size = (ref < "default") | "large" | ("small" > "default");
const dateSelect = ref("");
const isShowUpdateStatusForm = ref(false);
const statusSelected = ref("");
const refundIdSelected = ref("");
const billIdSelected = ref("");
const handleShowFormUpdate = (refund_request_id, bill_id, status) => {
    isShowUpdateStatusForm.value = true;
    refundIdSelected.value = refund_request_id;
    billIdSelected.value = bill_id;
    statusSelected.value = status;
}

const handleUpdateStatus = async () => {
    try {
        const response = await refundService.update({
            refund_request_status: statusSelected.value
        }, refundIdSelected.value);

        showSuccess("Cập nhật thành công");
        console.log(response);
        fetchListRefund();
        fetchToDayRefund();
        isShowUpdateStatusForm.value = false;
    } catch (error) {
        console.log(error.response);
    }
}

const fetchListRefund = async () => {
    try {
        const response = await refundService.getAll();
        listRefund.value = response.data;
        refundLength.value = response.data.length;
        console.log('List Refund: ', response);
    } catch (error) {
        console.log(error.response);
    }
}


const sortRefundShow = (type) => {
    switch (type) {
        case "today":
            todayRefundShow.value = true;
            allRefundShow.value = false;
            byDateRefundShow.value = false;
            break;
        case "all":
            todayRefundShow.value = false;
            allRefundShow.value = true;
            byDateRefundShow.value = false;
            break;
        default:
            type = "today";
            break;
    }
};

//End

const todayRefundShow = ref(true);
const allRefundShow = ref(false);
const byDateRefundShow = ref(false);
//
const todayRefundList = ref([]);
const todayRefundLength = ref(0);
const fetchToDayRefund = async () => {
    try {
        const response = await refundService.getToday();
        todayRefundList.value = response.data;
        todayRefundLength.value = response.length;
    } catch (error) {
        console.log(error.response);
    }
};
const sortTodayRefundList = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return todayRefundList.value.slice(startIndex, startIndex + pageSize);
});

const listRefundByDate = ref([]);
const refundByDateLength = ref(0);
const fetchRefundByDate = async (startDate, endDate) => {
    try {
        const response = await refundService.getBetweenDate({
            start_date: startDate,
            end_date: endDate,
        });
        listRefundByDate.value = response.data;
        refundByDateLength.value = response.length;
        console.log("By Date: ", response);
    } catch (error) {
        console.log(error.response);
    }
};
const sortDate = () => {
    byDateRefundShow.value = true;
    todayRefundShow.value = false;
    allRefundShow.value = false;
    const { startDate, endDate } = getDateRange();
    console.log("Start: ", startDate);
    console.log("endDate: ", endDate);
    fetchRefundByDate(startDate, endDate);
};

const sortBydayRefundList = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return listRefundByDate.value.slice(startIndex, startIndex + pageSize);
});

onMounted(() => {
    fetchToDayRefund();
    fetchListRefund();

    setTimeout(() => {
        // console.log("HIII: ", paginatedList.value);
    }, 2000);
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


const handleCurrentChange = (val) => {
    currentPage.value = val;
    console.log(`current page: ${val}`);
};

const refundListAll = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return listRefund.value.slice(startIndex, startIndex + pageSize);
});
</script>

<style scoped>
:deep(.el-pagination .el-pager .is-active) {
    background-color: black !important;
}

.yellow {
    color: yellow;
}

.primary-orange {
    color: #ffe599;
}

.orange {
    color: #ffa500;
}

.red {
    color: #c81f30;
}

.contain-table {
    padding-top: 0px !important;
}

.contain-search {
    display: flex;
}

.form-design {
    width: 220px;
    margin-left: 993px;
}

.design-input {
    border: none;
}

.design-button {
    padding: 4px 16px;
}

.el-col {
    text-align: center;
}

/* Table */
.table-responsive {
    max-height: 200px;
    overflow-y: auto;
}

.table thead th {
    position: sticky;
    top: 0;
    background-color: #ffffff;
    z-index: 1;
}

.table tbody th,
.table tbody td {
    z-index: 0;
}
</style>