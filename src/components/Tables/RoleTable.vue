<template>

    <div class="card-body">
        <div class="form-group pull-right contain-search">
            <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                @change="handleSearch" v-model="search" />

            <el-button style="height: 38px;" @click="centerDialogVisible = true">Thêm</el-button>
        </div>

        <el-dialog v-model="centerDialogVisible" title="Thêm vai trò" width="500" destroy-on-close center>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label fw-bold">{{ title }}</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" v-model="dataCreate.name"
                    :placeholder="title">
                <div v-if="errorName" class="text-danger">{{ errorName }}</div>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label fw-bold">{{ description }}</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" v-model="dataCreate.description"
                    :placeholder="description">
                <div v-if="errorDescription" class="text-danger">{{ errorDescription }}</div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">Hủy</el-button>
                    <el-button type="primary" @click="handleCreate">
                        Thêm
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <table class="table table-hover table-bordered results">
            <thead>
                <tr>
                    <th class="col text-center">STT</th>
                    <th class="col text-center">{{ title }}</th>
                    <th class="col text-center">{{ description }}</th>
                    <th class="col text-center">Ngày tạo</th>
                    <th class="col text-center"></th>
                    <th class="col text-center"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(data, index) in datasearch" :key="data.data_id">
                    <th scope="row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center"><input type="text" v-model="data.name" :readonly="index !== editingIndex"
                            :class="{ 'design-input': index !== editingIndex }" />
                    </td>

                    <td class="text-center">
                        <input style="width: 300px;" type="text" v-model="data.description"
                            :readonly="index !== editingIndex" :class="{ 'design-input': index !== editingIndex }" />
                    </td>
                    <td class="text-center">
                        {{ convertTime(data.created_at) }}
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-secondary design-button" @click="handleEdit(index)">
                            Sửa
                        </button>
                    </td>
                    <td class="text-center">
                        <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" width="200"
                            confirm-button-type="danger" title="Bạn có muốn xóa?" @confirm="handleDelete(data.id)">
                            <template #reference>
                                <el-button v-show="index !== editingIndex" type="danger">Xóa</el-button>
                            </template>
                        </el-popconfirm>
                        <button v-show="index === editingIndex" type="button" class="btn btn-sm btn-success"
                            @click="handleUpdate(data)">
                            Cập nhật
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(listData.length / pageSize) * 10" class="mt-4" />
        </div>
        <div v-show="datasearch.length === 0">
            <p class="text-center">Không có sản phẩm nào</p>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { convertTime } from "@/helpers/UtilHelper";

const search = ref("");
const pageSize = 8;
const currentPage = ref(1);
const editingIndex = ref(null);
const centerDialogVisible = ref(false)

const dataCreate = ref({
    name: "",
    description: "",
});

const errorName = ref("");
const errorDescription = ref("");

const props = defineProps({
    listData: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['handle-update', 'handle-delete']);

const handleUpdate = (data) => {
    emit('handle-update', data);
    editingIndex.value = null;
}

const handleDelete = (id) => {
    emit('handle-delete', id);
}

const handleCreate = () => {
    // Reset errors
    errorName.value = "";
    errorDescription.value = "";

    if (!dataCreate.value.name) {
        errorName.value = props.title + " không được để trống.";
    }
    if (!dataCreate.value.description) {
        errorDescription.value = props.description + " không được để trống.";
    }

    // Only emit if no errors
    if (!errorName.value && !errorDescription.value) {
        emit('handle-create', dataCreate.value);
        centerDialogVisible.value = false;

        dataCreate.value.name = "";
        dataCreate.value.description = "";
    }
};


onMounted(() => {
    console.log("List data in the role table: ", props);
})

const handleSearch = () => {
    console.log(search.value);
    console.log("cc :", datasearch.value);
};

const datasearch = computed(() => {
    const dataSearch = String(search.value).trim();
    const startIndex = (currentPage.value - 1) * pageSize;
    if (!dataSearch) {
        return props.listData?.slice(startIndex, startIndex + pageSize);
    }

    return props.listData?.filter((data) => {
        return (String(data.description) + String(data.name))
            .toLowerCase()
            .includes(dataSearch.toLowerCase());
    });
});

const handleEdit = (index) => {

    if (editingIndex.value === index) {
        editingIndex.value = null;
    } else {
        editingIndex.value = index;
    }
};

const handleCurrentChange = (val) => {
    currentPage.value = val;
    console.log(`current page: ${val}`);
};

</script>
<style scoped>
:deep(.el-pagination .el-pager .is-active) {
    background-color: black !important;
}


.contain-search {
    display: flex;
}

.form-design {
    width: 220px;

}

.design-input {
    border: none;
}

.design-button {
    padding: 4px 16px;
}

.border-none {
    border: none;
}
</style>