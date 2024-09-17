<template>
    <div id="layoutSidenav_content">
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">QUẢN LÝ KHUYẾN MÃI</h1>
                <!-- Modal -->

                <div class="card mb-4">
                    <el-tabs type="border-card" class="demo-tabs">
                        <el-tab-pane label="Khuyến mãi">
                            <Promotion />
                        </el-tab-pane>

                    </el-tabs>

                </div>
            </div>
        </main>
    </div>

</template>
<script setup>
import Promotion from '../components/Promotion/Promotion.vue';

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