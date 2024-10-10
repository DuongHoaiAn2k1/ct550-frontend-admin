<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">QUẢN LÝ KHO</h1>
        <!-- Modal -->

        <div class="card mb-4">
          <el-tabs v-model="activeTab" type="border-card" class="demo-tabs">
            <el-tab-pane label="Kho" name="product">
              <ProductTable v-if="activeTab === 'product'" />
            </el-tab-pane>
            <el-tab-pane label="Lô hàng" name="batch">
              <BatchTable v-if="activeTab === 'batch'" />
            </el-tab-pane>
            <el-tab-pane label="Tạm ẩn" name="hidden">
              <HiddenTable v-if="activeTab === 'hidden'" />
            </el-tab-pane>
            <el-tab-pane label="Sắp hết hạn" name="soon">
              <ExpiringSoonTable v-if="activeTab === 'soon'" />
            </el-tab-pane>
            <el-tab-pane label="Hết hạn" name="expired">
              <ExpiredTable v-if="activeTab === 'expired'" />
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
    </main>
  </div>

</template>
<script setup>
import ProductTable from "../components/Warehouse/ProductTable.vue";
import BatchTable from "../components/Warehouse/BatchTable.vue";
import HiddenTable from "../components/Warehouse/HiddenTable.vue";
import ExpiredTable from "../components/Warehouse/ExpiredTable.vue";
import ExpiringSoonTable from "../components/Warehouse/ExpiringSoonTable.vue";
import { ref } from 'vue';

const activeTab = ref('product');
// observing current pag
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
</style>