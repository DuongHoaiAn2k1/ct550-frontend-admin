<template>
  <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
    <!-- Navbar Brand-->
    <router-link class="navbar-brand ps-3" :to="{ name: 'home' }">Trang Quản Trị</router-link>
    <!-- Sidebar Toggle-->
    <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!">
      <i class="fas fa-bars"></i>
    </button>
    <!-- Navbar Search-->
    <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
      <div class="input-group">
        <!-- <input
            class="form-control"
            type="text"
            placeholder="Nhập từ khóa để tìm kiếm..."
            aria-label="Nhập từ khóa để tìm kiếm..."
            aria-describedby="btnNavbarSearch"
          />
          <button class="btn btn-primary" id="btnNavbarSearch" type="button">
            <i class="fas fa-search"></i>
          </button> -->
      </div>
    </form>
    <!-- Navbar-->
    <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" id="navbarUserDropdown" @click="showNotificationBox"><i
            class="fa-solid fa-bell"></i>
          <span class="badge rounded-pill badge-notification bg-danger sub-cart-design">{{
            unReadNumber || 0
            }}</span></a>

        <div v-if="isNotiticationBox" class="notification-container">
          <Notification />
        </div>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" id="navbarUserDropdown" href="#" role="button" data-bs-toggle="dropdown"
          aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarUserDropdown">
          <li>
            <router-link :to="{ name: 'profile' }" class="dropdown-item" href="#!">Tài khoản</router-link>
          </li>
          <li>
            <a class="dropdown-item" @click="handleLogout" href="#!">Đăng Xuất</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import notificationService from '@/services/notification.service';
// import { useNotificationStore } from "../stores/notification";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import Notification from "./Notifications/Notification.vue";
import { useProductBatchStore } from "../stores/productBatch";
import { useTodayOrder } from "../stores/todayOrder";
import { initializeEcho } from "../pusher/echoConfig";
import { showMessageBTRight } from "@/helpers/NotificationHelper";

const echoInstance = initializeEcho();
const productBatchStore = useProductBatchStore();
const todayOrderStore = useTodayOrder();
const isNotiticationBox = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const unReadNumber = ref(0);
const userId = computed(() => authStore.admin_id);
// const notificationStore = useNotificationStore();

// const unReadNumber = computed(() => notificationStore.count_unread);
const showNotificationBox = () => {
  isNotiticationBox.value = !isNotiticationBox.value;

}

const fetchNotifications = async () => {
  try {
    const response = await notificationService.getAll();
    console.log("FetchNotifications: ", response);
    unReadNumber.value = response.count_unread;
  } catch (error) {
    console.log(error)
  }
}
const handleLogout = async () => {
  try {
    // const response = await authService.logout();
    // console.log("Response after logout: ", response);
    authStore.logout();
    showLogoutSuccess();
    setTimeout(() => {
      router.push({ name: "login" });
    }, 500);
  } catch (error) {
    console.log(error.response);
  }
};

echoInstance.channel('admin-channel')
  .listen('.order.created', async (event) => {
    // const response = await notificationStore.getAll();
    // console.log('Chanel');
    setTimeout(() => {
      fetchNotifications();
      productBatchStore.fetchListProductBatch();
      todayOrderStore.fetchTodayOrderList();
      setTimeout(() => {
        showMessageBTRight('Đơn hàng mới', 'Vừa tiếp nhận đơn hàng mới');
      }, 500);
    }, 2000);

  });



onMounted(() => {
  console.log("Mountttttttttttt");
  fetchNotifications();

  console.log("UserId: ", userId.value);
  // if (localStorage.getItem("processRefreshToken") == "true") {
  //   router.push({ name: "token" });
  // }
  // await notificationStore.getAll();
})

watch(isNotiticationBox, async (newValue) => {
  if (newValue == false) {
    // await notificationStore.getAll();
    console.log('False!!!!!!!!!!');
    fetchNotifications();
  } else {
    const response = await notificationService.adminReadAll();
    console.log('TRueeeeeeeeeeeeeeeeeeeee');
    fetchNotifications();

  }
});

const showLogoutSuccess = () => {
  ElMessage({
    message: "Đăng xuất thành công.",
    type: "success",
  });
};
</script>

<style scoped>
.notification-container {
  position: absolute;
  top: 40px;
  /* Adjust this value to move the notification box down */
  right: 10px;
  /* Adjust this value if needed */
  width: 300px;
  z-index: 1000;
  /* Ensure it appears above other elements */
}

:deep(.el-notification) {
  border: 1px solid black !important;
}
</style>