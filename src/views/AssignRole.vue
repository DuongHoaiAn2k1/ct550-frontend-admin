<template>
    <div id="layoutSidenav_content">
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">QUẢN LÝ QUYỀN</h1>
                <!-- Modal -->

                <div class="card mb-4">
                    <el-tabs type="border-card" class="demo-tabs">
                        <el-tab-pane label="Vai trò">
                            <RoleTable :listData="listRole" @handle-update="handleUpdateRole"
                                @handle-delete="handleDeleteRole" @handle-create="handleCreateRole" title="Tên vai trò"
                                description="Mô tả vai trò" />
                        </el-tab-pane>
                        <el-tab-pane label="Quyền hạn">
                            <RoleTable :listData="listPermission" @handle-update="handleUpdatePermission"
                                @handle-delete="handleDeletePermission" @handle-create="handleCreatePermission"
                                title="Tên quyền" description="Mô tả quyền" />
                        </el-tab-pane>
                        <el-tab-pane label="Phân quyền">Assign</el-tab-pane>
                    </el-tabs>


                </div>
            </div>
        </main>
    </div>

</template>
<script setup>
import { Calendar } from '@element-plus/icons-vue'
import { computed, onMounted, ref, reactive } from "vue";
import { showSuccessMessage } from '../helpers/NotificationHelper';
import { showLoading } from '../helpers/LoadingHelper';
import roleService from "../services/role.service";

import RoleTable from '@/components/Tables/RoleTable.vue';

const listRole = ref([]);
const listPermission = ref([]);

const fetchListRole = async () => {
    try {
        const response = await roleService.getRoles();
        listRole.value = response.data;
        console.log("List role: ", response);
    } catch (error) {
        console.log(error);
    }
};

const fetchListPermission = async () => {
    try {
        const response = await roleService.getPermissions();
        console.log("List permission: ", response);
        listPermission.value = response.data;
    } catch (error) {
        console.log(error);
    }
}

const handleUpdateRole = async (role) => {
    try {
        const response = await roleService.updateRole(role.id, { name: role.name, description: role.description });
        console.log("Update role: ", response);
        showSuccessMessage("Cập nhật vai trò thành công");
    } catch (error) {
        console.log(error.response);
    }
}

const handleDeleteRole = async (id) => {
    try {
        const loading = showLoading();
        const response = await roleService.deleteRole(id).finally(() => {
            fetchListRole();
            showSuccessMessage("Xóa vai trò thành công");
            loading.close();
        })
        // console.log("Delete role: ", response);
    } catch (error) {
        console.log(error.response);
    }
}


const handleCreateRole = async (data) => {
    try {
        const loading = showLoading();
        const response = await roleService.createRole(data).finally(() => {
            fetchListRole();
            showSuccessMessage("Tạo vai thành công");
            loading.close();
        })
        // console.log("Create role: ", response);
    } catch (error) {
        console.log(error.response);
    }
}


const handleUpdatePermission = async (permission) => {
    try {
        const response = await roleService.updatePermission(permission.id, { name: permission.name, description: permission.description });
        // console.log("Update permission: ", response);
        showSuccessMessage("Cập nhật quyền thành công");
    } catch (error) {
        console.log(error.response);
    }
}

const handleDeletePermission = async (id) => {
    try {
        const loading = showLoading();
        const response = await roleService.deletePermission(id).finally(() => {
            fetchListPermission();
            showSuccessMessage("Xóa quyền thành công");
            loading.close();
        })
        // console.log("Delete permission: ", response);
    } catch (error) {
        console.log(error.response);
    }
}

const handleCreatePermission = async (data) => {
    try {
        const loading = showLoading();
        const response = await roleService.createPermission(data).finally(() => {
            fetchListPermission();
            showSuccessMessage("Tạo quyền mới thành công");
            loading.close();
        })
        // console.log("Create permission: ", response);
    } catch (error) {
        console.log(error.response);
    }
}

onMounted(() => {
    fetchListRole();
    fetchListPermission();
});

</script>

<style scoped>
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
</style>