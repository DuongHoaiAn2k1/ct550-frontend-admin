<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">Chi tiết đơn hàng</h1>

        <div class="mb-4">
          <section class="h-100 gradient-custom">
            <div class=" h-100">
              <div class="row">
                <div class="card" style="border-radius: 10px">
                  <div class="card-header px-4 py-2">
                    <h5 class="text-muted mb-0">
                      Tên khách hàng:
                      {{ address.name }}
                    </h5>
                    <p>
                      Trạng thái:
                      <select v-model="orderData.status">
                        <option value="preparing"><span class="text-primary">Đang chuẩn bị</span></option>
                        <option value="shipping"><span class="text-warning">Đang giao</span> </option>
                        <option value="delivered"><span class="text-success">Đã giao</span></option>
                        <option value="cancelled"><span class="text-danger">Đã hủy</span></option>
                      </select>
                    </p>
                    <p>
                      <button class="btn btn-dark" @click="handleUpdate(orderData.status)">
                        Cập nhật
                      </button>
                    </p>
                  </div>
                  <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <p class="lead fw-normal mb-0" style="color: #a8729a">
                        Chi tiết đơn hàng
                      </p>
                      <p class="small text-muted mb-0">
                        Mã đơn hàng: #{{ orderData.bill_id }}
                      </p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <p></p>
                      <p v-show="orderData.paid === 1 && orderData.status != 'cancelled'" class="small text-muted mb-0">
                        <el-tag style="font-size: 20px;" type="success">Đã thanh toán</el-tag>
                      </p>
                      <p v-show="orderData.status == 'pending_payment'" class="small text-muted mb-0">
                        <el-tag style="font-size: 20px;" type="warning">Chờ thanh toán</el-tag>
                      </p>
                      <p v-show="orderData.status == 'payment_failed'" class="small text-muted mb-0">
                        <el-tag style="font-size: 20px;" type="danger">Thanh toán thất bại</el-tag>
                      </p>
                      <p v-show="orderData.status === 'cancelled'" class="small text-muted mb-0">
                        <el-tag style="font-size: 20px;" type="danger">Đã hủy</el-tag>
                      </p>
                    </div>
                    <div class="card shadow-0 border mb-4">
                      <div class="row">
                        <div class="col-md-2"></div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text fw-bold mb-0">Tên sản phẩm</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text fw-bold mb-0 small">Số lượng</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text fw-bold mb-0 small">Kg/sản phẩm</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text fw-bold mb-0 small">Đơn giá</p>
                        </div>
                        <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p class="text fw-bold mb-0 small">Tổng</p>
                        </div>
                      </div>
                      <div class="card-body" v-for="data in orderData.order_detail" :key="data.order_detail_id">
                        <div class="row">
                          <div class="col-md-2">
                            <img :src="apiUrl +
                              JSON.parse(data.product.product_img)[0]
                              " class="img-fluid" alt="Phone" width="50px" />
                          </div>
                          <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                            <p class="text-muted mb-0">
                              {{ data.product.product_name }}
                            </p>
                          </div>
                          <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                            <p class="text-muted mb-0 small">
                              x{{ data.quantity }}
                            </p>
                          </div>
                          <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                            <p class="text-muted mb-0 small">1</p>
                          </div>
                          <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                            <p class="text-muted mb-0 small">
                              {{ formatCurrency(data.total_cost_detail / data.quantity) }}
                            </p>
                          </div>
                          <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                            <p class="text-muted mb-0 small">
                              {{
                                formatCurrency(
                                  data.total_cost_detail
                                )
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-between pt-2">
                      <p class="fw-bold mb-0">Chi tiết</p>
                      <p class="text-muted mb-0">
                        <span class="fw-bold me-4">Tổng</span>
                        {{ formatCurrency(orderData.total_cost) }}
                      </p>
                    </div>

                    <div class="d-flex justify-content-between pt-2">
                      <p class="text-muted mb-0">
                        <span class="fw-bold">Tên người nhận:</span>
                        {{ address.name }}
                      </p>
                      <p class="text-muted mb-0">
                        <span class="fw-bold me-4">Phí giao hàng</span>
                        {{ formatCurrency(orderData.shipping_fee) }}
                      </p>
                    </div>

                    <div class="d-flex justify-content-between">
                      <p class="text-muted mb-0">
                        <span class="fw-bold">Số điện thoại:</span>
                        {{ address.phone }}
                      </p>
                      <p class="text-muted mb-0">
                        <span class="fw-bold me-4">Điểm dùng</span>
                        - {{ orderData.point_used_order }} (
                        {{ formatCurrency(orderData.point_used_order * 1000) }})
                      </p>
                    </div>

                    <div class="d-flex justify-content-between mb-0">
                      <p class="text-muted mb-0">
                        <span class="fw-bold">Địa chỉ:</span>
                        {{ address.address }}, {{ address.commue }},
                        {{ address.district }}, {{ address.city }}
                      </p>
                      <p class="text-muted mb-0">

                      </p>
                    </div>
                    <div class="d-flex justify-content-between">
                      <p class="text-muted mb-0">
                        <span class="fw-bold">Ngày đặt:</span>
                        {{ covertTime(orderData.created_at) }}
                      </p>
                    </div>
                  </div>
                  <div class="card-footer border-0 px-4 py-2" style="
                        background-color: #000;
                        border-bottom-left-radius: 10px;
                        border-bottom-right-radius: 10px;
                      ">
                    <h5 class="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                      TỔNG TIỀN THANH TOÁN:
                      <span class="h2 mb-0 ms-2">{{
                        formatCurrency(orderData.total_cost)
                        }}</span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <el-button class="mt-2" @click="showInvoice = true">Xuất hóa đơn</el-button>
        </div>
      </div>
      <el-dialog v-model="showInvoice" title="" width="600" destroy-on-close center>
        <Invoice :customerName="address.name" :billId="orderData.bill_id" :date="orderData.created_at"
          :items="orderData" />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showInvoice = false">Hủy</el-button>

          </div>
        </template>
      </el-dialog>
    </main>
  </div>
</template>

<script setup>
import orderService from "@/services/order.service";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElLoading, ElNotification, ElMessage } from "element-plus";
import Invoice from "../components/Invoice/Invoice.vue";
import { initializeEcho } from "@/pusher/echoConfig";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const route = useRoute();
const orderId = route.params.id;
const address = ref([]);
const orderData = ref([]);
const showInvoice = ref(false);
const echoInstance = initializeEcho();

echoInstance.channel('admin-channel')
  .listen('.order.cancelled', async (event) => {
    setTimeout(() => {
      fetchOrder();
    }, 1000);
  });

const showUpdateSuccess = () => {
  ElMessage({
    message: "Cập nhật trạng thái thành công.",
    type: "success",
  });
};
const fetchOrder = async () => {
  try {
    const response = await orderService.get(orderId);
    orderData.value = response.data;
    address.value = JSON.parse(response.data.order_address);
    console.log("Detail of order: ", response);
  } catch (error) {
    console.log(error.response);
  }
};

const handleUpdate = (status) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Đang xử lý...",
    background: "rgba(0,0,0, 0.7)",
  });
  setTimeout(() => {
    updateStatus(status, orderId);
    showUpdateSuccess();
    loading.close();
  }, 1000);
};
const updateStatus = async (status, orderId) => {
  try {
    const response = await orderService.updateStatus(
      { status: status },
      orderId
    );
    fetchOrder();
  } catch (error) {
    console.log(error.response);
  }
};
onMounted(() => {
  fetchOrder();
});

const formatCurrency = (amount) => {
  return (
    amount?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }) || ""
  );
};

const covertTime = (dateTimeString) => {
  var dateTime = moment(dateTimeString);
  dateTime.utcOffset(7);

  var formattedDateTime = dateTime.format("DD/MM/YYYY HH:mm:ss");
  return formattedDateTime;
};
</script>