<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">DANH SÁCH ĐƠN HÀNG</h1>

        <div class="card mb-4">
          <div class="card-header">
            <el-button @click="sortOrderShow('today')">Hôm nay</el-button>
            <el-button @click="sortOrderShow('all')">Tất cả</el-button>
            <el-date-picker class="ms-3" v-model="dateSelect" type="daterange" range-separator="Đến"
              start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :size="size" />
            <el-button @click="sortDate">Lọc</el-button>
            <span v-show="todayOrderShow" class="ms-2" style="font-size: 14px">Kết quả: {{ todayOrderStore.length
              }}</span>
            <span v-show="allOrderShow" class="ms-2" style="font-size: 14px">Kết quả: {{ orderLength }}</span>
            <span v-show="byDateOrderShow" class="ms-2" style="font-size: 14px">Kết quả: {{ orderByDateLength }}</span>
          </div>
          <div class="card-body">
            <div class="form-group pull-right contain-search"></div>
            <span class="counter pull-right"></span>
            <table class="table table-hover table-bordered results">
              <thead>
                <tr>
                  <th>STT</th>
                  <th class="col">Mã đơn hàng</th>
                  <th class="col">Hình ảnh</th>
                  <th class="col">Tổng tiền
                    <button class="border-none" @click="sortByMoney">
                      <i class="fa-solid fa-sort"></i>
                    </button>
                  </th>
                  <th class="col">Thời gian đặt hàng</th>
                  <th class="col">Trạng thái
                    <button class="border-none" @click="sortByStatus">
                      <i class="fa-solid fa-sort"></i>
                    </button>
                  </th>
                  <th class="col">Chi tiết</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-show="todayOrderShow" v-for="(data, index) in sortTodayOrderList" :key="data.order_id">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>#{{ data.bill_id }}</td>
                  <td>
                    <img :src="apiUrl +
                      JSON.parse(data.order_detail[0]?.product?.product_img)[0]
                      " alt="" width="50px" />
                  </td>
                  <td>{{ formatCurrency(data.total_cost) }}</td>
                  <td>{{ convertTime(data.created_at) }}</td>
                  <td>
                    <span v-show="data.status == 'payment_failed'"
                      class="badge rounded-pill text-danger font-size-11 task-status">Thanh toán thất bại</span>
                    <span v-show="data.status == 'pending_payment'"
                      class="badge rounded-pill text-warning font-size-11 task-status">Chờ thanh toán</span>
                    <span v-show="data.status == 'preparing'"
                      class="badge rounded-pill text-info font-size-11 task-status">Đang
                      chuẩn bị</span>
                    <span v-show="data.status == 'shipping'"
                      class="badge rounded-pill orange font-size-11 task-status">Đang
                      giao</span>
                    <span v-show="data.status == 'delivered'"
                      class="badge rounded-pill text-success font-size-11 task-status">Đã giao</span>
                    <span v-show="data.status == 'cancelled'" class="badge rounded-pill red font-size-11 task-status">Đã
                      hủy</span>
                  </td>
                  <td>
                    <router-link :to="{
                      name: 'order-detail',
                      params: { id: data.order_id },
                    }">Xem chi tiết</router-link>
                  </td>
                  <td>
                    <el-button @click="handleDeleteOrder(data.order_id)"><i class="fa-solid fa-trash"></i></el-button>
                  </td>
                </tr>

                <tr v-show="allOrderShow" v-for="(data, index) in orderListAll" :key="data.order_id">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>#{{ data.bill_id }}</td>
                  <td>
                    <img :src="apiUrl +
                      JSON.parse(data.order_detail[0].product.product_img)[0]
                      " alt="" width="50px" />
                  </td>
                  <td>{{ formatCurrency(data.total_cost) }}</td>
                  <td>{{ convertTime(data.created_at) }}</td>
                  <td>
                    <span v-show="data.status == 'payment_failed'"
                      class="badge rounded-pill text-danger font-size-11 task-status">Thanh toán thất bại</span>
                    <span v-show="data.status == 'pending_payment'"
                      class="badge rounded-pill text-warning font-size-11 task-status">Chờ thanh toán</span>
                    <span v-show="data.status == 'preparing'"
                      class="badge rounded-pill text-info font-size-11 task-status">Đang
                      chuẩn bị</span>
                    <span v-show="data.status == 'shipping'"
                      class="badge rounded-pill orange font-size-11 task-status">Đang
                      giao</span>
                    <span v-show="data.status == 'delivered'"
                      class="badge rounded-pill text-success font-size-11 task-status">Đã giao</span>
                    <span v-show="data.status == 'cancelled'" class="badge rounded-pill red font-size-11 task-status">Đã
                      hủy</span>
                  </td>
                  <td>
                    <router-link :to="{
                      name: 'order-detail',
                      params: { id: data.order_id },
                    }">Xem chi tiết</router-link>
                  </td>
                  <td>
                    <el-button @click="handleDeleteOrder(data.order_id)"><i class="fa-solid fa-trash"></i></el-button>
                  </td>
                </tr>
                <tr v-show="byDateOrderShow" v-for="(data, index) in sortBydayOrderList" :key="data.order_id">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>#{{ data.bill_id }}</td>
                  <td>
                    <img :src="apiUrl +
                      JSON.parse(data.order_detail[0].product.product_img)[0]
                      " alt="" width="50px" />
                  </td>
                  <td>{{ formatCurrency(data.total_cost) }}</td>
                  <td>{{ convertTime(data.created_at) }}</td>
                  <td>
                    <span v-show="data.status == 'payment_failed'"
                      class="badge rounded-pill text-danger font-size-11 task-status">Thanh toán thất bại</span>
                    <span v-show="data.status == 'pending_payment'"
                      class="badge rounded-pill text-warning font-size-11 task-status">Chờ thanh toán</span>
                    <span v-show="data.status == 'preparing'"
                      class="badge rounded-pill text-info font-size-11 task-status">Đang
                      chuẩn bị</span>
                    <span v-show="data.status == 'shipping'"
                      class="badge rounded-pill orange font-size-11 task-status">Đang
                      giao</span>
                    <span v-show="data.status == 'delivered'"
                      class="badge rounded-pill text-success font-size-11 task-status">Đã giao</span>
                    <span v-show="data.status == 'cancelled'" class="badge rounded-pill red font-size-11 task-status">Đã
                      hủy</span>
                  </td>
                  <td>
                    <router-link :to="{
                      name: 'order-detail',
                      params: { id: data.order_id },
                    }">Xem chi tiết</router-link>
                  </td>
                  <td>
                    <el-button @click="handleDeleteOrder(data.order_id)"><i class="fa-solid fa-trash"></i></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-end">
              <el-pagination v-show="todayOrderShow" v-model:current-page="currentPage"
                @current-change="handleCurrentChange" size="small" background layout="prev, pager, next"
                :total="Math.ceil(todayOrderStore.length / pageSize) * 10" class="mt-4" />

              <el-pagination v-show="allOrderShow" v-model:current-page="currentPage"
                @current-change="handleCurrentChange" size="small" background layout="prev, pager, next"
                :total="Math.ceil(orderLength / pageSize) * 10" class="mt-4" />

              <el-pagination v-show="byDateOrderShow" v-model:current-page="currentPage"
                @current-change="handleCurrentChange" size="small" background layout="prev, pager, next"
                :total="Math.ceil(orderByDateLength / pageSize) * 10" class="mt-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import orderService from "@/services/order.service";
import { onMounted, ref, computed, watch } from "vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { convertTime, formatCurrency } from "@/helpers/UtilHelper";
import { useTodayOrder } from "../stores/todayOrder";
import { initializeEcho } from "../pusher/echoConfig";
const apiUrl = import.meta.env.VITE_APP_API_URL;

const echoInstance = initializeEcho();
echoInstance.channel('admin-channel')
  .listen('.order.cancelled', async (event) => {
    if (todayOrderShow.value) {
      todayOrderStore.fetchTodayOrderList();
    }
    if (allOrderShow.value) {
      fetchListOrder();
    }
  });

echoInstance.channel('payment-set-status')
  .listen('.preparing', async (event) => {
    if (todayOrderShow.value) {
      todayOrderStore.fetchTodayOrderList();
    }
    if (allOrderShow.value) {
      fetchListOrder();
    }
  });


const currentPage = ref(1);
const listOrder = ref([]);
const pageSize = 8;
const orderLength = ref(0);
const size = (ref < "default") | "large" | ("small" > "default");
const dateSelect = ref("");
const todayOrderStore = useTodayOrder();

const fetchListOrder = async () => {
  try {
    const response = await orderService.getAll();
    listOrder.value = response.data;
    orderLength.value = response.length;
    console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};

const deleteOrder = async (id) => {
  try {
    const response = await orderService.delete(id);
  } catch (error) {
    console.log(error.response);
  }
};

const handleDeleteOrder = (orderId) => {
  // alert(orderId);
  ElMessageBox.confirm("Bạn có chắc muốn xóa đơn hàng này?", "Thông báo", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      deleteOrder(orderId);
      const loading = ElLoading.service({
        lock: true,
        text: "Đang xử lý...",
        background: "rgba(0,0,0, 0.7)",
      });
      setTimeout(() => {
        fetchListOrder();
        todayOrderStore.fetchTodayOrderList();
        loading.close();

        ElMessage({
          type: "success",
          message: "Xóa đơn hàng thành công",
        });
      }, 2000);
    })
    .catch(() => {
      // ElMessage({
      //   type: "info",
      //   message: "Delete canceled",
      // });
    });
};

//Handle show Order
const todayOrderShow = ref(true);
const allOrderShow = ref(false);
const byDateOrderShow = ref(false);

const sortOrderShow = (type) => {
  switch (type) {
    case "today":
      todayOrderShow.value = true;
      allOrderShow.value = false;
      byDateOrderShow.value = false;
      break;
    case "all":
      todayOrderShow.value = false;
      allOrderShow.value = true;
      byDateOrderShow.value = false;
      break;
    // case "byDate":
    //   todayOrderShow.value = false;
    //   allOrderShow.value = false;
    //   byDateOrderShow.value = true;
    //   break;
    default:
      type = "today";
      break;
  }
};

//End

//

const sortTodayOrderList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  return todayOrderStore.todayOrderList.slice(startIndex, startIndex + pageSize);
});

const listOrderByDate = ref([]);
const orderByDateLength = ref(0);
const sortOrderByDate = async (startDate, endDate) => {
  try {
    const response = await orderService.getByDate({
      start_date: startDate,
      end_date: endDate,
    });
    listOrderByDate.value = response.data;
    orderByDateLength.value = response.length;
    console.log("By Date: ", response);
  } catch (error) {
    console.log(error.response);
  }
};
const sortDate = () => {
  byDateOrderShow.value = true;
  todayOrderShow.value = false;
  allOrderShow.value = false;
  const { startDate, endDate } = getDateRange();
  console.log("Start: ", startDate);
  console.log("endDate: ", endDate);
  sortOrderByDate(startDate, endDate);
};

const sortBydayOrderList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  return listOrderByDate.value.slice(startIndex, startIndex + pageSize);
});

watch(() => todayOrderStore.length, (newValue) => {
  if (newValue) {
    todayOrderStore.fetchTodayOrderList();
  }
}, { deep: true });

onMounted(() => {
  fetchListOrder();
  todayOrderStore.fetchTodayOrderList();
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

const orderListAll = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  // Sử dụng filteredOrders.value thay vì listOrder.value
  return listOrder.value.slice(startIndex, startIndex + pageSize);
});


//Sort by money
const sortOrderPoint = ref("ascending");

const toggleSortOrder = () => {
  sortOrderPoint.value = sortOrderPoint.value === "ascending" ? "descending" : "ascending";
};

const sortByMoney = () => {
  const sorting = sortOrderPoint.value === 'ascending' ? 1 : -1;

  if (todayOrderShow.value) {
    todayOrderStore.todayOrderList.sort((a, b) => (a.total_cost - b.total_cost) * sorting);
  }

  if (allOrderShow.value) {
    listOrder.value.sort((a, b) => (a.total_cost - b.total_cost) * sorting);
  }

  if (byDateOrderShow.value) {
    listOrderByDate.value.sort((a, b) => (a.total_cost - b.total_cost) * sorting);
  }

  toggleSortOrder();
};

const sortByStatus = () => {
  const sorting = sortOrderPoint.value === 'ascending' ? 1 : -1;
  if (todayOrderShow.value) {
    todayOrderStore.todayOrderList.sort((a, b) => a.status.localeCompare(b.status) * sorting);
  }
  if (allOrderShow.value) {
    listOrder.value.sort((a, b) => a.status.localeCompare(b.status) * sorting);
  }

  if (byDateOrderShow.value) {
    listOrderByDate.value.sort((a, b) => a.status.localeCompare(b.status) * sorting);
  }

  toggleSortOrder();
};


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