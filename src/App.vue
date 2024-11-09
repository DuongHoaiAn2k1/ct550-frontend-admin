<template>
  <el-config-provider :locale="vi">
    <AppHeader v-if="showHeaderFooter" />
    <div id="layoutSidenav">
      <SideBar v-if="showHeaderFooter" />
      <router-view />
    </div>
    <AppFooter v-if="showHeaderFooter" />
  </el-config-provider>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import SideBar from "@/components/SideBar.vue";
import { ElConfigProvider } from 'element-plus'
import vi from 'element-plus/es/locale/lang/vi'

const route = useRoute();

const showHeaderFooter = computed(() => {
  return route.name !== 'login';
});
</script>

<style>
body {
  margin: 0;
  font-family: "Quicksand", sans-serif !important;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>