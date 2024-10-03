<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">THỐNG KÊ</h1>

        <div class="row">
          <div class="col-xl-3 col-md-6" @click="showDetail('customer')">
            <div class="card bg-dark text-white mb-4">
              <div class="card-body">Khách hàng</div>
              <div class="card-footer d-flex align-items-center justify-content-between">
                <a class="small text-white stretched-link" href="#">Xem chi tiết</a>
                <div class="small text-white">
                  <i class="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6" @click="showDetail('product')">
            <div class="card bg-dark text-white mb-4">
              <div class="card-body">Sản phẩm</div>
              <div class="card-footer d-flex align-items-center justify-content-between">
                <a class="small text-white stretched-link" href="#">Xem chi tiết</a>
                <div class="small text-white">
                  <i class="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6" @click="showDetail('order')">
            <div class="card bg-dark text-white mb-4">
              <div class="card-body">Đơn hàng</div>
              <div class="card-footer d-flex align-items-center justify-content-between">
                <a class="small text-white stretched-link" href="#">Xem chi tiết</a>
                <div class="small text-white">
                  <i class="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6" @click="showDetail('income')">
            <div class="card bg-dark text-white mb-4">
              <div class="card-body">Doanh Thu</div>
              <div class="card-footer d-flex align-items-center justify-content-between">
                <a class="small text-white stretched-link" href="#">Xem chi tiết</a>
                <div class="small text-white">
                  <i class="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer View -->
        <div v-show="showCustomer">
          <CustomerTable />
        </div>

        <!-- Product View -->
        <div v-show="showProduct">
          <ProductTable />
        </div>


        <!-- Orders View -->
        <div v-show="showOrder">
          <OrderTable />

        </div>


        <!-- Income View -->
        <div v-show="showIncome">
          <Revenue />
        </div>

      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import orderService from "@/services/order.service";
import CustomerTable from "../components/Statistics/CustomerTable.vue";
import ProductTable from "../components/Statistics/ProductTable.vue";
import OrderTable from "../components/Statistics/OrderTable.vue";
import Revenue from "../components/Statistics/Revenue.vue";
import {
  ArrowRight,
  CaretBottom,
  CaretTop,
  Warning,
} from "@element-plus/icons-vue";
const showCustomer = ref(true);
const showProduct = ref(false);
const showOrder = ref(false);
const showIncome = ref(false);
const listOrderUser = ref([]);



const showDetail = (type) => {
  switch (type) {
    case "customer":
      showCustomer.value = true;
      showProduct.value = false;
      showOrder.value = false;
      showIncome.value = false;

      break;
    case "product":
      showCustomer.value = false;
      showProduct.value = true;
      showOrder.value = false;
      showIncome.value = false;
      break;
    case "order":
      showCustomer.value = false;
      showProduct.value = false;
      showOrder.value = true;
      showIncome.value = false;
      break;
    case "income":
      showCustomer.value = false;
      showProduct.value = false;
      showOrder.value = false;
      showIncome.value = true;
      break;
    default:
      break;
  }
};

const value = ref("1");
const valueCondition = ref("1");
watch(value, (newValue, oldValue) => {
  // Nếu giá trị mới của value khác giá trị cũ
  if (newValue !== oldValue) {
    // Đặt lại giá trị của valueCondition về 1
  }
});

</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}




.form-design {
  width: 220px;
  /* margin-left: 1010px; */
  margin-left: 1176px;
}

.ms-10 {
  margin-left: 180px;
}
</style>