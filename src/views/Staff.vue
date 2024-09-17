<template>
    <div id="layoutSidenav_content">
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">QUẢN LÝ NHÂN VIÊN</h1>

                <div class="card mb-4">
                    <div class="card-body">
                        <div class="form-group pull-right contain-search">
                            <input type="text" class="search form-control form-design"
                                placeholder="Nhập từ khóa tìm kiếm" v-model="search" />
                            <el-button @click="showFormCreate = true" style="height: 38px;">Tạo mới</el-button>
                        </div>

                        <span class="counter pull-right"></span>
                        <table class="table table-hover table-bordered results">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th class="col">Tên nhân viên</th>
                                    <th class="col">Email</th>
                                    <th class="col">Vai trò</th>
                                    <th class="col">Thời gian tham gia</th>
                                    <th class="col">Chi tiết</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(user, index) in listStaff" :key="user.id">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ user.name }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>Nhân viên</td>
                                    <td>{{ convertTime(user.created_at) }}</td>
                                    <!-- <td>
                                        <el-button plain @click="
                                            handleDetailUser(user.id, user.name, user.point_used)
                                            ">
                                            Xem
                                        </el-button>
                                    </td> -->
                                    <td>
                                        <el-button @click="handleShowWarningDelete(user.id)"><i
                                                class="fa-solid fa-trash"></i></el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="text-end">
                            <!-- <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange"
                                small background layout="prev, pager, next"
                                :total="Math.ceil(listCustomerLength / pageSize) * 10" class="mt-4" /> -->
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <el-dialog v-model="showFormCreate" title="Thêm nhân viên" width="500" center>
            <div class="mb-3">
                <label for="name" class="form-label">Họ và tên</label>
                <input v-model="dataCreateStaff.name" type="text" class="form-control" id="name"
                    placeholder="Vui lòng nhập tên đăng nhập">

                <div class="ms-1 text-danger">
                    {{ nameError }}
                </div>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="dataCreateStaff.email" type="email" class="form-control" id="email"
                    placeholder="Vui lòng nhập email">
                <div class="ms-1 text-danger">
                    {{ emailNameError }}
                </div>
            </div>
            <div class="mb-3">
                <label for="userName" class="form-label">Tên đăng nhập</label>
                <input v-model="dataCreateStaff.username" type="text" class="form-control" id="userName"
                    placeholder="Vui lòng nhập tên đăng nhập">
                <div class="ms-1 text-danger">
                    {{ userNameError }}
                </div>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <input v-model="dataCreateStaff.password" type="password" class="form-control" id="password"
                    placeholder="Vui lòng nhập mật khẩu">
                <div class="ms-1 text-danger">
                    {{ passwordError }}
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showFormCreate = false">Hủy</el-button>
                    <el-button type="primary" @click="handleCreateStaff">
                        Tạo
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="showWarning" title="Cảnh báo" width="500" center>
            <p class="text-center text-danger">
                Bạn có chắc chắn muốn xóa nhân viên này!
            </p>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showWarning = false">Hủy</el-button>
                    <el-button type="primary" @click="handleDeleteStaff">
                        Xóa
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { convertTime } from '../helpers/UtilHelper';
import adminService from '../services/admin.service';
import { showLoading } from '../helpers/LoadingHelper';
import { showSuccess } from '../helpers/NotificationHelper';
import * as Yup from "yup";

const showWarning = ref(false);
const showFormCreate = ref(false);
const listStaff = ref([]);
const search = ref('');

const nameError = ref(null);
const emailNameError = ref(null);
const userNameError = ref(null);
const passwordError = ref(null);

const userSelectId = ref(null);

const dataCreateStaff = ref({
    name: '',
    email: '',
    username: '',
    password: '',
});

const schema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên nhân viên"),
    email: Yup.string().required("Vui lòng nhập email"),
    username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
})
const fetchStaff = async () => {
    try {
        const response = await adminService.getListStaff();
        listStaff.value = response.data;
        console.log("List staff: ", response);
    } catch (error) {
        console.log(error.response);
    }
}

const handleCreateStaff = async () => {
    nameError.value = null;
    emailNameError.value = null;
    userNameError.value = null;
    passwordError.value = null;

    schema
        .validate(dataCreateStaff.value, { abortEarly: false })
        .then(async () => {
            const response = await adminService.createStaff(dataCreateStaff.value);
            showSuccess(response.message);
            showFormCreate.value = false;
            fetchStaff();
        })
        .catch((errors) => {
            if (errors && errors.inner) {
                errors.inner.forEach((error) => {
                    if (error.path === 'name') {
                        nameError.value = error.message;
                    }
                    if (error.path === 'email') {
                        emailNameError.value = error.message;
                    }
                    if (error.path === 'username') {
                        userNameError.value = error.message;
                    }
                    if (error.path === 'password') {
                        passwordError.value = error.message;
                    }
                });
            }
        });


}

const handleShowWarningDelete = (id) => {
    showWarning.value = true;
    userSelectId.value = id;
}

const handleDeleteStaff = async () => {
    try {
        const response = await adminService.deleteStaff(userSelectId.value);
        showSuccess(response.message);
        showWarning.value = false;
        fetchStaff();
    } catch (error) {
        console.log(error.response);
    }
}



watch(search, (newData) => {
    if (newData !== "") {
        listStaff.value = listStaff.value.filter((item) => {
            return item.name.toLowerCase().includes(newData.toLowerCase());
        });
        // console.log("List staff search: ", listStaff.value);
    }
})

watch(dataCreateStaff.value, (newData) => {
    if (newData) {
        nameError.value = null;
        emailNameError.value = null;
        userNameError.value = null;
        passwordError.value = null;
    }
})

onMounted(() => {
    fetchStaff();
})
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
    /* margin-left: 993px; */
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