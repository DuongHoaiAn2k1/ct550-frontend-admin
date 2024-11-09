<template>
    <div class="card-body">
        <div class="form-group pull-right contain-search">
            <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                @change="handleSearch" v-model="search" />
            <div>
                <el-date-picker style="height: 38px;" v-model="dateSelect" type="daterange" range-separator="Đến"
                    start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" size="default" />
                <el-button style="height: 38px;" @click="handleFilterBatch">Lọc</el-button>
            </div>
            <el-button style="height: 38px;" @click="centerDialogVisible = true">Nhập hàng</el-button>
            <el-button style="height: 38px; margin: 0;" @click="isShowCreatePromotionForm = true">Tạo khuyến
                mãi</el-button>
        </div>
        <el-dialog v-model="isShowCreatePromotionForm" title="Tạo khuyến mãi" width="700" destroy-on-close center>
            <div class="mb-3">
                <label for="promotionName" class="form-label">Tên khuyến mãi</label>
                <input v-model="promotionData.promotionName" type="text" class="form-control" id="promotionName"
                    placeholder="Nhập tên chương trình khuyến mãi">
            </div>
            <div class="mb-3">
                <label for="discount" class="form-label">Phần trăm khuyến mãi</label>
                <input v-model="promotionData.discountPercentage" @input="handleInput" type="number"
                    class="form-control" id="discount" placeholder="Nhập phần trăm khuyến mãi" min="0" max="100">
                <div v-if="discountError" class="text-danger">{{ discountError }}</div>
            </div>
            <div class="mb-3">
                <label for="discount" class="form-label me-2">Nhóm người dùng</label>
                <el-select v-model="promotionData.roles" placeholder="Chọn danh mục" style="width: 180px" clearable
                    multiple disabled>
                    <el-option label="normal_user" value="normal_user" />
                    <el-option label="loyal_customer" value="loyal_customer" />
                </el-select>
                <div v-if="discountError" class="text-danger">{{ discountError }}</div>
            </div>
            <div class="mb-3">
                <div class="flex flex-wrap gap-4 items-center">
                    <el-select placeholder="Chọn lô" style="width: 180px" :model-value="'Sắp hết hạn'">
                        <el-option label="Sắp hết hạn" value="Sắp hết hạn" :selected="true" />
                    </el-select>

                    <el-select v-model="promotionData.batchSelect" placeholder="--Chọn--" style="width: 180px" clearable
                        multiple>
                        <el-option v-for="data in listBatch" :key="data.batch_id" :value="data.batch_id">
                            {{ data.batch_id }} - {{ data.product.product_name }} - Còn lại {{
                                daysUntil(data.expiry_date) }} ngày
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="mb-3">
                <label for="startDate" class="form-label me-2">Ngày bắt đầu</label>
                <el-date-picker v-model="promotionData.startDate" type="date" placeholder="Pick a day" size="default" />
            </div>
            <div class="mb-3">
                <label for="endDate" class="form-label me-2">Ngày kết thúc</label>
                <el-date-picker v-model="promotionData.endDate" type="date" placeholder="Pick a day" size="default" />
            </div>

            <div>

            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShowCreatePromotionForm = false">Hủy</el-button>
                    <el-button style="background-color: black; color: white;" @click="handleCreatePromotion">
                        Tạo
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="centerDialogVisible" title="NHẬP HÀNG" width="900" destroy-on-close center>
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
            <div class="row">
                <div class="col">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label fw-bold">Giá nhập (Tổng lô hàng)</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1"
                            v-model="batchData.batch_cost" placeholder="Giá nhập">
                        <div v-if="errors.batch_cost" class="text-danger">{{ formatCurrency(errors.batch_cost) }}</div>
                    </div>
                </div>
                <div class="col">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label fw-bold">Số lượng sản phẩm trong lô hàng
                        </label>
                        <input type="text" class="form-control" id="exampleFormControlInput1"
                            v-model="batchData.quantity" placeholder="Số lượng nhập">
                        <div v-if="errors.quantity" class="text-danger">{{ errors.quantity }}</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label fw-bold">Ngày nhập</label>
                        <div><el-date-picker v-model="batchData.entry_date" type="date" placeholder="Pick a day"
                                size="default" />
                        </div>
                        <div v-if="errors.entry_date" class="text-danger">{{ errors.entry_date }}</div>
                    </div>
                </div>
                <div class="col">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label fw-bold">Ngày hết hạn</label>
                        <div><el-date-picker v-model="batchData.expiry_date" type="date" placeholder="Pick a day"
                                size="default" />
                        </div>
                        <div v-if="errors.expiry_date" class="text-danger">{{ errors.expiry_date }}</div>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">Hủy</el-button>
                    <el-button type="" @click="handleCreate">
                        Thêm
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <table class="table table-hover table-bordered results">
            <thead>
                <tr>
                    <th class="col text-center">STT</th>
                    <th class="col text-center">Mã lô hàng</th>
                    <th class="col text-center">Tên sản phẩm</th>
                    <th class="col text-center">Giá nhập</th>
                    <th class="col text-center">Số lượng hiện có</th>
                    <th class="col text-center">Số lượng đã bán</th>
                    <th class="col text-center">Ngày nhập</th>
                    <th class="col text-center">Ngày hết hạn</th>
                    <th class="col text-center">Người nhập</th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="(batch, index) in datasearch" :key="batch.batch_id">
                    <th scope="row" class="text-center">{{ index + 1 }}</th>
                    <td class="text-center">{{ batch.batch_id }}</td>
                    <td class="text-center">{{ batch?.product?.product_name }}</td>
                    <td class="text-center">{{ formatCurrency(batch.batch_cost) }}</td>
                    <td class="text-center">{{ batch.quantity }}</td>

                    <td class="text-center">
                        {{ batch.sold_quantity }}
                    </td>
                    <td class="text-center">{{ formatDate(batch.entry_date) }}</td>
                    <td class="text-center">{{ formatDate(batch.expiry_date) }}</td>
                    <td class="text-center">{{ batch.user.name }}</td>

                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(batchLength / pageSize) * 10" class="mt-4" />
        </div>
        <div v-show="datasearch.length === 0">
            <p class="text-center">Không có lô hàng nào</p>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useCategoryStore } from '../../stores/category';
import batchService from '../../services/batch.service';
import productService from '../../services/product.service';
import { showLoading } from '../../helpers/LoadingHelper';
import { formatCurrency } from '../../helpers/UtilHelper'
import promotionService from '@/services/promotion.service';
import { showWarning, showSuccess } from '../../helpers/NotificationHelper';

const discountError = ref('');
const dateSelect = ref([]);
const centerDialogVisible = ref(false)
const currentPage = ref(1);
const pageSize = 8;
const search = ref("");
const batchLength = ref(0);
const listBatch = ref([]);
const categoryStore = useCategoryStore();
const categorySelect = ref("");
const productSelect = ref("");
const listProductByCategory = ref([]);
const isShowCreatePromotionForm = ref(false);
const promotionData = ref({
    promotionName: '',
    discountPercentage: 0,
    roles: [
        'normal_user',
        'loyal_customer',
    ],
    batchSelect: [],
    startDate: '',
    endDate: '',
});
const errors = ref({
    categorySelect: '',
    productSelect: '',
    batch_cost: '',
    quantity: '',
    entry_date: '',
    expiry_date: ''
});

const validateFields = () => {
    let isValid = true;
    errors.value = {
        categorySelect: '',
        productSelect: '',
        batch_cost: '',
        quantity: '',
        entry_date: '',
        expiry_date: ''
    };

    if (!categorySelect.value) {
        errors.value.categorySelect = 'Danh mục không được để trống';
        isValid = false;
    }

    if (!productSelect.value) {
        errors.value.productSelect = 'Sản phẩm không được để trống';
        isValid = false;
    }

    if (!batchData.value.batch_cost) {
        errors.value.batch_cost = 'Giá nhập không được để trống';
        isValid = false;
    }

    if (!batchData.value.quantity) {
        errors.value.quantity = 'Số lượng sản phẩm không được để trống';
        isValid = false;
    }

    if (!batchData.value.entry_date) {
        errors.value.entry_date = 'Ngày nhập không được để trống';
        isValid = false;
    }

    if (!batchData.value.expiry_date) {
        errors.value.expiry_date = 'Ngày hết hạn không được để trống';
        isValid = false;
    }

    return isValid;
};

const handleCreatePromotion = async () => {
    const loading = showLoading();
    try {
        if (discountError.value === '' && promotionData.value.promotionName !== '') {
            const convertToDateString = (timestamp) => {
                const date = new Date(timestamp * 1000);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            promotionData.value.startDate = convertToDateString(Math.floor(new Date(promotionData.value.startDate).getTime() / 1000));
            promotionData.value.endDate = convertToDateString(Math.floor(new Date(promotionData.value.endDate).getTime() / 1000));
            console.log("Sending request with data:", promotionData.value);
            const response = await promotionService.createBatch({
                "promotion_name": promotionData.value.promotionName,
                "discount_percentage": promotionData.value.discountPercentage,
                "user_group": promotionData.value.roles,
                "batch_select": promotionData.value.batchSelect,
                "start_date": promotionData.value.startDate,
                "end_date": promotionData.value.endDate
            });
            console.log("Response from server:", response);
            setTimeout(() => {
                loading.close();
                showSuccess("Tạo khuyến mãi thành công");
            }, 500);
            // console.log(response);
            isShowCreatePromotionForm.value = false;
        }

        // console.log("create promotion: ", promotionData.value);
    } catch (error) {
        console.log(error);
        if (error.response.data.error == 'exists') {
            showWarning(`Sản phẩm ${error.response.data.product.product_name} đã tồn tại khuyến mãi`, 'right');
        }
        loading.close();
    }
}


const batchData = ref({
    product_id: "",
    batch_cost: "",
    quantity: "",
    entry_date: "",
    expiry_date: ""
})

const handleSearch = () => {
    console.log(search.value);
};

const fetchListBatch = async () => {
    try {
        const response = await batchService.getExpringSoonList();
        listBatch.value = response.data;
        batchLength.value = response.data.length;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
};

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

const datasearch = computed(() => {
    const dataSearch = String(search.value).trim();
    const startIndex = (currentPage.value - 1) * pageSize;
    if (!dataSearch) {
        return listBatch.value.slice(startIndex, startIndex + pageSize);
    }
    return listBatch.value.filter((data) => {
        return String(data.product_name)
            .toLowerCase()
            .includes(dataSearch.toLowerCase());
    });
});

const handleCreate = async () => {
    if (!validateFields()) {
        return;
    }
    try {
        batchData.value.product_id = productSelect.value;
        const convertToDateString = (timestamp) => {
            const date = new Date(timestamp * 1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        batchData.value.entry_date = convertToDateString(Math.floor(new Date(batchData.value.entry_date).getTime() / 1000));
        batchData.value.expiry_date = convertToDateString(Math.floor(new Date(batchData.value.expiry_date).getTime() / 1000));
        const loading = showLoading();
        const response = await batchService.create(batchData.value).finally(() => {
            loading.close();
            fetchListBatch();
            centerDialogVisible.value = false;
        })
        console.log(response);
        // console.log("BatchData: ", batchData.value);
    } catch (error) {
        console.log(error);
    }
};

const unHidden = async (id) => {
    try {
        const response = await batchService.updateStatus(id, {
            status: 'Active'
        });
        console.log('Hidden: ', response);
        fetchListBatch();
    } catch (error) {
        console.log(error.response);
    }
}


onMounted(async () => {
    fetchListBatch();
    await categoryStore.fetchListCategory();
});

watch(categorySelect, (newData) => {
    if (newData !== "") {
        fetchProductByCategoryName(newData);
    }
    productSelect.value = "";
});

watch(productSelect, (newData) => {
    if (newData !== "") {
        // alert(newData);
    }
})

const startDate = ref('');
const endDate = ref('');

const handleFilterBatch = () => {
    if (!startDate.value || !endDate.value) {
        fetchListBatch();
    }

    const filteredBatch = listBatch.value.filter((batch) => {
        const entryDate = new Date(batch.entry_date).getTime();
        const start = new Date(startDate.value).getTime();
        const end = new Date(endDate.value).getTime();

        return entryDate >= start && entryDate <= end;
    });

    listBatch.value = filteredBatch;
};


watch(dateSelect, (newData) => {
    if (newData) {
        startDate.value = formatDateSelect(newData[0]);
        endDate.value = formatDateSelect(newData[1]);
        //alert(`Start Date: ${startDate.value}\nEnd Date: ${endDate.value}`);
    } else {
        startDate.value = '';
        endDate.value = '';
    }
});

const formatDate = (dateTime) => {
    return dateTime.split(' ')[0];
};

const formatDateSelect = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Tháng từ 0-11
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const handleCurrentChange = (val) => {
    currentPage.value = val;
    console.log(`current page: ${val}`);
};

const daysUntil = (targetDate) => {
    const now = new Date();
    const endDate = new Date(targetDate);

    const timeDifference = endDate - now;

    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
}
</script>


<style scoped>
:deep(.el-pagination .el-pager .is-active) {
    background-color: black !important;
}

/* :deep(.el-date-editor .el-range-separator) {
    width: 40px;
}

:deep(.el-date-editor .el-range-input) {
    width: 100px;
} */

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