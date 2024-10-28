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
        </div>
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
                    <th class="col text-center"></th>
                    <th class="col text-center"></th>
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
                    <td class="text-center"><el-button type="danger" round @click="hidden(batch.batch_id)">Ẩn lô
                            hàng</el-button></td>
                    <td class="text-center"> <el-button @click="showBoxBatchDetail(batch.batch_id)">Xem đơn</el-button>
                    </td>

                </tr>
            </tbody>
        </table>
        <div class="text-end">
            <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next"
                :total="Math.ceil((search ? datasearch.length : listBatch.length) / pageSize) * 10" class="mt-4" />
        </div>
        <div v-show="datasearch.length === 0">
            <p class="text-center">Không có lô hàng nào</p>
        </div>
    </div>

    <el-dialog v-model="showOrderDetailBatch" title="Yêu cầu hoàn tiền của bạn" width="1000" center>
        <section class="intro">
            <div class="gradient-custom-1 h-100">
                <div class="mask d-flex align-items-center h-100">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="table-responsive bg-white">
                                    <table class="table mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">STT</th>
                                                <th scope="col">Mã đơn hàng</th>
                                                <th scope="col">Số lượng</th>
                                                <th scope="col">Chi tiết</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr v-for="(data, index) in paginatedOrderDetailBathes"
                                                :key="data.order_detail_id">
                                                <th scope="row" style="color: #666666">
                                                    {{ index + 1 }}
                                                </th>
                                                <td>
                                                    #{{ data.bill_id }}
                                                </td>

                                                <td>
                                                    {{ data.product_count }}
                                                </td>
                                                <td>
                                                    <router-link :to="{
                                                        name: 'order-detail',
                                                        params: { id: data.order_id },
                                                    }">Xem chi tiết</router-link>
                                                </td>

                                            </tr>

                                        </tbody>
                                    </table>
                                    <div class="text-center">
                                        <span v-show="listOrderWithBatch.length == 0" style="font-size: 20px;"> Không có
                                            yêu
                                            cầu nào</span>
                                    </div>
                                    <div class="text-end">
                                        <el-pagination v-model:current-page="currentOrderDetailBatchPage"
                                            @current-change="handleCurrentOrderDetailBatchChange" small background
                                            layout="prev, pager, next"
                                            :total="Math.ceil(listOrderWithBatch.length / pageSize) * 10"
                                            class="mt-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </el-dialog>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useCategoryStore } from '../../stores/category';
import batchService from '../../services/batch.service';
import productService from '../../services/product.service';
import { showLoading } from '../../helpers/LoadingHelper';
import { formatCurrency } from '../../helpers/UtilHelper'

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
const showOrderDetailBatch = ref(false);
const listOrderWithBatch = ref([]);



//////Begin order batches handle////////

const currentOrderDetailBatchPage = ref(1);
const handleCurrentOrderDetailBatchChange = (val) => {
    currentOrderDetailBatchPage.value = val
}
const showBoxBatchDetail = (id) => {
    showOrderDetailBatch.value = true
    fetchOrderDetailBatch(id);
}

const fetchOrderDetailBatch = async (id) => {
    try {
        const response = await batchService.getBatchWithDetail(id);
        listOrderWithBatch.value = response.orders;
        console.log('listOrderWithBatch', response);
    } catch (error) {
        console.log(error)
    }
}

const paginatedOrderDetailBathes = computed(() => {
    const start = (currentOrderDetailBatchPage.value - 1) * pageSize;
    const end = start + pageSize;
    return listOrderWithBatch.value.slice(start, end);
})
//////End order batches handle////////

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
        const response = await batchService.getAll();
        listBatch.value = response.data;
        batchLength.value = response.data.length;
        console.log('List batch :', response);
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
        return String(data.product.product_name)
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

const hidden = async (id) => {
    try {
        const response = await batchService.updateStatus(id, {
            status: 'Hidden'
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