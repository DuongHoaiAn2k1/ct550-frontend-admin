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
                        <el-tab-pane label="Phân quyền">
                            <el-select v-model="role" placeholder="Select" size="large" style="width: 240px">
                                <el-option v-for="item in listRole" :key="item.id" :label="item.name"
                                    :value="item.name" />
                            </el-select>
                            <el-transfer v-model="permission" :data="transferData"
                                :titles="['Danh sách quyền', 'Quyền hiện tại']" />
                            <el-button size="large" class="mt-3" @click="updatePermissionsForRole">Cập nhật</el-button>
                        </el-tab-pane>
                    </el-tabs>


                </div>
            </div>
        </main>
    </div>

</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { showSuccessMessage, showWarning } from '../helpers/NotificationHelper';
import { showLoading } from '../helpers/LoadingHelper';
import roleService from "../services/role.service";

import RoleTable from '@/components/Tables/RoleTable.vue';

const data = ref([]);
const role = ref('');
const permission = ref([]);

const listRole = ref([]);
const listPermission = ref([]);
const transferData = ref([]);


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

        transferData.value = listPermission.value.map(permission => ({
            key: permission.id,
            label: permission.name,
            description: permission.description
        }));

    } catch (error) {
        console.log(error);
    }
}

const fetchPermissionsByRole = async (roleId) => {
    try {
        const response = await roleService.getPermissionsByRoleName(roleId);
        const selectedPermissions = response.data;
        permission.value = selectedPermissions.map(permission => permission.id);
        console.log("Permissions for role:", selectedPermissions);
    } catch (error) {
        console.log(error);
    }
};

watch(role, (newRole) => {
    if (newRole) {
        fetchPermissionsByRole(newRole);
        // alert(newRole);
    }
});

const updatePermissionsForRole = async () => {
    try {
        const selectedPermissions = permission.value;
        const roleId = listRole.value.find(r => r.name === role.value)?.id;

        if (!roleId) {
            showWarning("Vui lòng chọn vai trò.");
            return;
        }
        const loading = showLoading();

        const response = await roleService.updatePermissionsForRole(roleId, selectedPermissions).finally(() => {
            loading.close();
            showSuccessMessage("Cập nhật quyền thành công");
            console.log("Update permissions response: ", response);
        })


    } catch (error) {
        console.log(error.response);
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

.el-transfer-panel {
    width: 20% !important;
}

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
