<template>
  <div id="layoutSidenav_nav">
    <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div class="sb-sidenav-menu">
        <div class="nav">
          <router-link :to="{ name: 'home' }" class="nav-link collapsed">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-list"></i>
            </div>
            DANH MỤC
          </router-link>
          <router-link :to="{ name: 'product' }" class="nav-link collapsed">
            <div class="sb-nav-link-icon">
              <i class="fa-brands fa-product-hunt"></i>
            </div>
            SẢN PHẨM
          </router-link>

          <router-link class="nav-link collapsed" :to="{ name: 'customer' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            KHÁCH HÀNG
          </router-link>
          <router-link class="nav-link" :to="{ name: 'order' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-clipboard"></i>
            </div>
            ĐƠN HÀNG
          </router-link>
          <router-link class="nav-link" :to="{ name: 'statistics' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-chart-simple"></i>
            </div>
            THỐNG KÊ
          </router-link>
          <router-link class="nav-link" :to="{ name: 'warehouse' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-warehouse"></i>
            </div>
            KHO
          </router-link>
          <router-link class="nav-link" :to="{ name: 'review' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-message"></i>
            </div>
            ĐÁNH GIÁ
          </router-link>
          <router-link v-show="currentRole === 'admin'" class="nav-link" :to="{ name: 'assign-role' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-gear"></i>
            </div>
            PHÂN QUYỀN
          </router-link>

          <router-link class="nav-link" :to="{ name: 'refund' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-money-bill"></i>
            </div>
            HOÀN TIỀN
          </router-link>

          <router-link class="nav-link" :to="{ name: 'promotion' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-percent"></i>
            </div>
            KHUYẾN MÃI
          </router-link>

          <router-link class="nav-link" :to="{ name: 'message' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-message"></i>
            </div>
            TIN NHẮN
          </router-link>

          <router-link v-show="currentRole === 'admin'" class=" nav-link" :to="{ name: 'refund' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-user-ninja"></i>
            </div>
            TIẾP THỊ
          </router-link>

          <router-link v-show="currentRole === 'admin'" class="nav-link" :to="{ name: 'staff' }">
            <div class="sb-nav-link-icon">
              <i class="fa-solid fa-users-gear"></i>
            </div>
            NHÂN VIÊN
          </router-link>

        </div>
      </div>
      <div class="sb-sidenav-footer"></div>
    </nav>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { onMounted, ref, watch } from "vue";
import { useCurrentRole } from "../stores/currentRole";

const currentRoleStore = useCurrentRole();
const currentRole = ref(currentRoleStore.getCurrentRole());

onMounted(() => {
  currentRole.value = atob(currentRoleStore.getCurrentRole()) || "";
});

// Theo dõi sự thay đổi của currentRoleStore.currentRole
watch(() => currentRoleStore.currentRole, (newRole) => {
  currentRole.value = atob(newRole) || "";
});
</script>
