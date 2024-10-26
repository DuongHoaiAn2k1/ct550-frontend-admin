<template>

    <div class="card-body">
        <div class="form-group pull-right contain-search">
            <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                @change="handleSearch" v-model="search" />

            <el-button style="height: 38px;" @click="showFormCreateCommission = true">Tạo</el-button>
        </div>

        <el-dialog v-model="showFormCreateCommission" title="Tạo mức hoa hồng" width="800" destroy-on-close center>
            <div class="row mb-3">
                <div class="col">
                    <el-select v-model="categorySelect" placeholder="Chọn danh mục" size="large" style="width: 240px">
                        <el-option v-for="item in categoryStore.listCategory" :key="item.category_id"
                            :label="item.category_name" :value="item.category_name" />
                    </el-select>
                    <div v-if="errors.categorySelect" class="text-danger">{{ errors.categorySelect }}</div>
                </div>
                <div class="col">
                    <el-select v-model="productSelect" placeholder="Chọn sản phẩm" size="large" style="width: 240px">
                        <el-option v-for="item in listProductByCategory" :key="item.product_id"
                            :label="item.product_name" :value="item.product_id" />
                    </el-select>
                    <div v-if="errors.productSelect" class="text-danger">{{ errors.productSelect }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <div class="mb-3">
                        <label for="commission_rate" class="form-label fw-bold">Mức hoa hồng
                        </label>
                        <input type="text" class="form-control" id="commission_rate" maxlength="2"
                            placeholder="Mức hoa hồng (VD: 15 = 15%)">
                        <div v-if="errors.commission_rate" class="text-danger">{{ errors.commission_rate }}</div>
                    </div>
                </div>
                <div class="col">
                </div>
            </div>


            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showFormCreateCommission = false">Hủy</el-button>
                    <el-button type="primary" @click="handleCreate">
                        Tạo
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <table class="table table-hover table-bordered results">
            <thead>
                <tr>
                    <th class="col text-center">STT</th>
                    <th class="col text-center">Tên sản phẩm</th>
                    <th class="col text-center">Mức hoa hồng</th>
                    <th class="col text-center">Ngày tạo</th>
                    <th class="col text-center"></th>
                    <th class="col text-center"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(data, index) in dataCommission" :key="data.data_id">
                    <th scope="row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center">
                        {{ data.product.product_name }}
                    </td>

                    <td class="text-center">
                        {{ formatPercent(data.commission_rate) }}
                    </td>
                    <td class="text-center">
                        {{ convertTime(data.created_at) }}
                    </td>
                    <td class="text-center">
                        <el-button type="primary" :icon="Edit" circle @click="handleShowFormUpdate(data)" />
                    </td>

                    <td class="text-center">
                        <el-button type="danger" :icon="Delete" circle
                            @click="handleDeleteCommission(data.commission_id)" />
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(listCommission.length / pageSize) * 10" class="mt-4" />
        </div>
        <div v-show="dataCommission.length === 0">
            <p class="text-center">Không có sản phẩm nào</p>
        </div>
    </div>

    <el-dialog v-model="showUpdate" title="Cập nhật hoa hồng" width="500" center>
        <div class="mb-3">
            <label for="commission_rate" class="form-label fw-bold">Mức hoa hồng</label>
            <input type="text" v-model="commissionRateUpdate" class="form-control" id="commission_rate"
                placeholder="Mức hoa hồng (VD: 15 = 15%)">
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showUpdate = false">Hủy</el-button>
                <el-button type="primary" @click="handleUpdateCommission">
                    Cập nhật
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useCategoryStore } from '../../stores/category';
import affiliateService from '../../services/affiliate.service';
import productService from '../../services/product.service';
import { convertTime } from '../../helpers/UtilHelper';
import { showSuccess, showWarning } from '../../helpers/NotificationHelper'
import {
    Delete,
    Edit,
} from '@element-plus/icons-vue'

const showUpdate = ref(false);
const search = ref("");
const currentPage = ref(1);
const pageSize = 8;
const categorySelect = ref("");
const productSelect = ref("");
const listProductByCategory = ref([]);
const categoryStore = useCategoryStore();
const listCommission = ref([]);
const commissionRateUpdate = ref(0);
const commissionIdUpdate = ref(0);
const errors = ref({
    categorySelect: '',
    productSelect: '',
    commission_rate: '',
});

const validateFields = () => {
    let isValid = true;
    errors.value = {
        categorySelect: '',
        productSelect: '',
        commission_rate: '',
    };

    if (!categorySelect.value) {
        errors.value.categorySelect = 'Danh mục không được để trống';
        isValid = false;
    }

    if (!productSelect.value) {
        errors.value.productSelect = 'Sản phẩm không được để trống';
        isValid = false;
    }

    if (!commission_rate.value) {
        errors.value.commission_rate = 'Hoa hồng không được để trống';
        isValid = false;
    }

    return isValid;
};

const handleShowFormUpdate = (data) => {
    commissionRateUpdate.value = data.commission_rate;
    commissionIdUpdate.value = data.commission_id;
    showUpdate.value = true;
}

const handleUpdateCommission = async () => {
    try {
        const response = await affiliateService.updateCommission({
            commission_rate: commissionRateUpdate.value,
        }, commissionIdUpdate.value);
        if (response.status == 'success') {
            showSuccess("Cập nhật hoa hồng thành công");
        }
        console.log("update commission: ", response);
        showUpdate.value = false;
        fetchListCommission();
    } catch (error) {
        console.log(error);
    }
}

const handleDeleteCommission = async (id) => {
    try {
        const response = await affiliateService.deleteCommission(id);
        if (response.status == 'success') {
            showSuccess("Xóa hoa hồng thành công");
        }
        console.log("delete commission: ", response);
        fetchListCommission();
    } catch (error) {
        console.log(error.response);
    }
}

const fetchProductByCategoryName = async (categoryName) => {
    try {
        const response = await productService.getProductByCategoryName({
            category_name: categoryName
        });
        listProductByCategory.value = response.data;
        console.log("listProductByCategory: ", response);
    } catch (error) {
        console.log(error);
    }
}

const handleCreate = async () => {
    if (!validateFields()) {
        return;
    }
    try {
        const response = await affiliateService.createCommission({
            product_id: productSelect.value,
            commission_rate: commission_rate.value
        });
        if (response.status == 'success') {
            showSuccess("Tạo hoa hồng cho sản phẩm thành công");

        }
        console.log("create commission: ", response);
        showFormCreateCommission.value = false;
        fetchListCommission();
    } catch (error) {
        if (error.response.data.message = 'Sản phẩm đã tồn tại') {
            showWarning("Sản phẩm đã tồn tại");
        }
        console.log(error.response);
    }
}

const fetchListCommission = async () => {
    try {
        const response = await affiliateService.getListCommission();
        listCommission.value = response.data;
        console.log("List commission: ", response);
        console.log('length list commission: ', listCommission.value.length);
    } catch (error) {
        console.log(error);
    }
};

onMounted(async () => {
    await categoryStore.fetchListCategory();
    fetchListCommission();
    console.log("List commission length: ", dataCommission.value);
});

const dataCommission = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (!search.value) {
        return listCommission.value.slice(startIndex, endIndex);
    }

    return listCommission.value.filter((data) => {
        return String(data.product.product_name)
            .toLowerCase()
            .includes(search.value.toLowerCase());
    });
});


watch(categorySelect, (newData) => {
    if (newData !== "") {
        fetchProductByCategoryName(newData);
    }
    productSelect.value = "";
});



const handleCurrentChange = (val) => {
    currentPage.value = val;
    console.log(`current page: ${val}`);
};

const formatPercent = (value) => {
    return value + '%';
}


const showFormCreateCommission = ref(false);
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