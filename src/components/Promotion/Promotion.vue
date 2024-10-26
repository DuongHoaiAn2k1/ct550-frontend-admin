<template>
    <main>

        <div class="card mb-4">
            <div class="card-header">
                <el-date-picker class="ms-3" v-model="dateSelect" type="daterange" range-separator="Đến"
                    start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" size="default" />
                <el-button @click="sortDate">Lọc</el-button>
                <el-button @click="isShowCreatePromotionForm = true">Tạo</el-button>
            </div>
            <div class="card-body">
                <div class="form-group pull-right contain-search"></div>
                <span class="counter pull-right"></span>
                <table class="table table-hover table-bordered results">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th class="col text-center">Tên khuyến mãi</th>
                            <th class="col text-center">Phần trăm khuyến mãi</th>
                            <th class="col text-center">Nhóm sản phẩm</th>
                            <th class="col text-center">Nhóm người dùng</th>
                            <th class="col text-center">Thời gian bắt đầu</th>
                            <th class="col text-center">Thời gian kết thúc</th>
                            <th class="col text-center"></th>
                            <th class="col text-center"></th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="(promotion, index) in endDataPromotion" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td class="col ">{{ promotion.promotion_name }}</td>
                            <td class="col ">
                                {{ promotion.discount_percentage }} %
                            </td>
                            <td class="col ">
                                <span class="row">
                                    <span class="col" style="display: block;">
                                        <span v-for="item in promotion.product_promotion" :key="item.id"
                                            style="display: block;">{{
                                                item.product.product_name }}, </span>

                                    </span>

                                    <span class="col text-end">
                                        <el-button :icon="Edit" @click="handleProductPromotion(promotion)" />
                                    </span>
                                </span>
                            </td>
                            <td class="col ">
                                <span class="row">
                                    <span class="col" style="display: block;">
                                        <span v-for="item in JSON.parse(promotion.user_group)" style="display: block;">
                                            {{ item }}
                                        </span>

                                    </span>

                                </span>
                            </td>
                            <td class="col "> {{ convertTime(promotion.start_date) }}</td>

                            <td class="col ">
                                {{ convertTime(promotion.end_date) }}
                            </td>
                            <td class="text-center">
                                <el-button style="background-color: black; color: white;"
                                    @click="handleSoftDelete(promotion.promotion_id)">
                                    Xóa
                                </el-button>
                            </td>
                            <td class="text-center">
                                <el-button style="background-color: red; color: white;"
                                    @click="handleUpdatePromotion(promotion)">
                                    Chỉnh sửa
                                </el-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <el-dialog v-model="isShowCreatePromotionForm" title="Tạo khuyến mãi" width="500" destroy-on-close
                    center>
                    <div class="mb-3">
                        <label for="promotionName" class="form-label">Tên khuyến mãi</label>
                        <input v-model="promotionData.promotionName" type="text" class="form-control" id="promotionName"
                            placeholder="Nhập tên chương trình khuyến mãi">
                    </div>
                    <div class="mb-3">
                        <label for="discount" class="form-label">Phần trăm khuyến mãi</label>
                        <input v-model="promotionData.discountPercentage" @input="handleInput" type="number"
                            class="form-control" id="discount" placeholder="Nhập phần trăm khuyến mãi" min="0"
                            max="100">
                        <div v-if="discountError" class="text-danger">{{ discountError }}</div>
                    </div>
                    <div class="mb-3">
                        <label for="discount" class="form-label me-2">Nhóm người dùng</label>
                        <el-select v-model="promotionData.roles" placeholder="Chọn danh mục" style="width: 180px"
                            clearable multiple>
                            <el-option label="normal_user" value="normal_user" />
                            <el-option label="loyal_customer" value="loyal_customer" />
                        </el-select>
                        <div v-if="discountError" class="text-danger">{{ discountError }}</div>
                    </div>
                    <div class="mb-3">
                        <label for="startDate" class="form-label me-2">Ngày bắt đầu</label>
                        <el-date-picker v-model="promotionData.startDate" type="date" placeholder="Pick a day"
                            size="default" />
                    </div>
                    <div class="mb-3">
                        <label for="endDate" class="form-label me-2">Ngày kết thúc</label>
                        <el-date-picker v-model="promotionData.endDate" type="date" placeholder="Pick a day"
                            size="default" />
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

                <el-dialog v-model="isShowUpdatePromotionForm" title="Cập nhật khuyến mãi" width="500" destroy-on-close
                    center>
                    <div class="mb-3">
                        <label for="promotionName" class="form-label">Tên khuyến mãi</label>
                        <input v-model="currentDataPromotion.promotion_name" type="text" class="form-control"
                            id="promotionName" placeholder="Nhập tên chương trình khuyến mãi">
                    </div>
                    <div class="mb-3">
                        <label for="discount" class="form-label">Phần trăm khuyến mãi</label>
                        <input v-model="currentDataPromotion.discount_percentage" @input="handleInputUpdate"
                            type="number" class="form-control" id="discount" placeholder="Nhập phần trăm khuyến mãi"
                            min="0" max="100">
                        <div v-if="discountError" class="text-danger">{{ discountError }}</div>
                    </div>
                    <div class="mb-3">
                        <label for="discount" class="form-label me-2">Nhóm người dùng</label>
                        <el-select v-model="currentDataPromotion.user_group" placeholder="Chọn danh mục"
                            style="width: 180px" clearable multiple>
                            <el-option label="normal_user" value="normal_user" />
                            <el-option label="loyal_customer" value="loyal_customer" />
                        </el-select>
                        <div v-if="discountError" class="text-danger">{{ discountError }}</div>
                    </div>
                    <div class="mb-3">
                        <label for="startDate" class="form-label me-2">Ngày bắt đầu</label>
                        <el-date-picker v-model="currentDataPromotion.start_date" type="date" placeholder="Pick a day"
                            size="default" />
                    </div>
                    <div class="mb-3">
                        <label for="endDate" class="form-label me-2">Ngày kết thúc</label>
                        <el-date-picker v-model="currentDataPromotion.end_date" type="date" placeholder="Pick a day"
                            size="default" />
                    </div>

                    <div>

                    </div>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="isShowCreatePromotionForm = false">Hủy</el-button>
                            <el-button style="background-color: black; color: white;"
                                @click="handleSubmitUpdatePromotion">
                                Cập nhật
                            </el-button>
                        </div>
                    </template>
                </el-dialog>

                <el-dialog v-model="isShowProductPromotion" title="Nhóm sản phẩm" width="500" destroy-on-close center>
                    <div class="mb-3">
                        <div class="flex flex-wrap gap-4 items-center">
                            <el-select v-model="categorySelect" placeholder="Chọn danh mục" style="width: 180px"
                                clearable>
                                <el-option v-for="item in listCategory" :key="item.category_id"
                                    :label="item.category_name" :value="item.category_name" />
                            </el-select>

                            <el-select v-model="productSelect" placeholder="Chọn sản phẩm" style="width: 180px"
                                clearable multiple>
                                <el-option v-for="data in filteredProducts" :key="data.product_id"
                                    :label="data.product_name" :value="data.product_id" />
                            </el-select>
                        </div>
                        <div class="mt-4">
                            <label for="discount" class="form-label">Các sản phẩm hiện tại</label>
                            <ul>
                                <li v-for="item in productPromotionSelect" :key="item.id">{{ item.product.product_name
                                    }} <el-button style="border: none;" :icon="Delete"
                                        @click="handleDeleteProductPromotion(item.id)">
                                    </el-button></li>
                            </ul>
                        </div>
                    </div>
                    <div>

                    </div>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="isShowProductPromotion = false">Hủy</el-button>
                            <el-button style="background-color: black; color: white;"
                                @click="handleAddProductPromotion">
                                Thêm
                            </el-button>
                        </div>
                    </template>
                </el-dialog>


                <div class="text-end" v-show="endDataPromotion.length > 0">
                    <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small
                        background layout="prev, pager, next"
                        :total="Math.ceil(endDataPromotion.length / pageSize) * 10" class="mt-4" />
                </div>
                <div v-show="endDataPromotion.length === 0">
                    <p class="text-center">Không có khuyến mãi nào</p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import promotionService from '@/services/promotion.service';
import { showLoading } from '../../helpers/LoadingHelper';
import { showSuccess } from '../../helpers/NotificationHelper';
import { convertTime } from '../../helpers/UtilHelper';
import { Edit, Delete } from '@element-plus/icons-vue'
import categoryService from '../../services/category.service';
import productService from '../../services/product.service';
import productPromotionService from '../../services/productPromotion.service';

const currentPage = ref(1);
const pageSize = 8;
const startDateFilter = ref("");
const endDateFilter = ref("");
const dateSelect = ref("");
const discountError = ref('');
const categorySelect = ref("");
const listProduct = ref([]);
const productSelect = ref([]);
const promotionIdSelect = ref("");
const discountPercentage = ref(0);
const productPromotionSelect = ref([]);

const isShowCreatePromotionForm = ref(false);
const isShowProductPromotion = ref(false);
const isShowUpdatePromotionForm = ref(false);
const promotionData = ref({
    promotionName: '',
    discountPercentage: 0,
    roles: [],
    startDate: '',
    endDate: '',
});
const listCategory = ref([]);
const listPromotion = ref([]);

const currentDataPromotion = ref({});

const fetchListCategory = async () => {
    try {
        const response = await categoryService.getAll();
        listCategory.value = response.listCategory;
        console.log(response);
    } catch (error) {
        console.log(error.response);
    }
}

const filteredProducts = computed(() => {
    const selectedIds = productPromotionSelect.value.map(item => item.product.product_id);
    return listProduct.value.filter(product => !selectedIds.includes(product.product_id));
});

const handleDeleteProductPromotion = async (id) => {
    try {
        const response = await productPromotionService.delete(id);
        console.log(response);
        showSuccess("Xóa sản phẩm thành công");
        handleFetchPromotion();
        isShowProductPromotion.value = false;
    } catch (error) {
        console.log(error.response);
    }
}

const fetchProductByCategoryName = async (name) => {
    try {
        const response = await productService.getProductByCategoryName({
            category_name: name
        });
        console.log('Fetch product by category: ', response);
        listProduct.value = response.data;
    } catch (error) {
        console.log(error.response)
    }
}

const handleCreatePromotion = async () => {
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
            const loading = showLoading();
            console.log("Sending request with data:", promotionData.value);
            const response = await promotionService.create({
                "promotion_name": promotionData.value.promotionName,
                "discount_percentage": promotionData.value.discountPercentage,
                "user_group": promotionData.value.roles,
                "start_date": promotionData.value.startDate,
                "end_date": promotionData.value.endDate
            });
            console.log("Response from server:", response);
            setTimeout(() => {
                loading.close();
                handleFetchPromotion();
                showSuccess("Tạo khuyến mãi thành công");
            }, 500);
            // console.log(response);
            isShowCreatePromotionForm.value = false;
        }


    } catch (error) {
        console.log(error.response);
    }
}

const fetchDetailPromotionById = async (id) => {
    try {
        const response = await promotionService.getDetail(id);
        currentDataPromotion.value = response.data;
        currentDataPromotion.value.user_group = JSON.parse(response.data.user_group);
        // console.log("Current data Promotion: ", currentDataPromotion.value);
    } catch (error) {
        console.log(error.response);
    }
}

const handleUpdatePromotion = (promotion) => {
    promotionIdSelect.value = promotion.promotion_id;
    fetchDetailPromotionById(promotionIdSelect.value);
    isShowUpdatePromotionForm.value = true;
};

const handleSubmitUpdatePromotion = async () => {
    // console.log("Current data Promotion: ", currentDataPromotion.value);
    try {

        const convertToDateString = (timestamp) => {
            const date = new Date(timestamp * 1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        if (typeof currentDataPromotion.value.start_date === 'object') {
            currentDataPromotion.value.start_date = convertToDateString(Math.floor(new Date(currentDataPromotion.value.start_date).getTime() / 1000));
        } else {
            currentDataPromotion.value.start_date = currentDataPromotion.value.start_date;
        }

        if (typeof currentDataPromotion.value.end_date === 'object') {
            currentDataPromotion.value.end_date = convertToDateString(Math.floor(new Date(currentDataPromotion.value.end_date).getTime() / 1000));
        } else {
            currentDataPromotion.value.end_date = currentDataPromotion.value.end_date;
        }
        console.log("Sending request with data:", currentDataPromotion.value);
        console.log("Lenght: ", typeof currentDataPromotion.value.start_date);
        const loading = showLoading();  // Hiển thị loading khi gửi yêu cầu
        const response = await promotionService.update({
            "promotion_name": currentDataPromotion.value.promotion_name,
            "discount_percentage": currentDataPromotion.value.discount_percentage,
            "user_group": currentDataPromotion.value.user_group,
            "start_date": currentDataPromotion.value.start_date,
            "end_date": currentDataPromotion.value.end_date
        }, promotionIdSelect.value);

        console.log("Response from server:", response);
        setTimeout(() => {
            loading.close();
            handleFetchPromotion();
            showSuccess("Cập nhật khuyến mãi thành công");
        }, 500);

        isShowUpdatePromotionForm.value = false;

    } catch (error) {
        console.log(error.response);
    }
};


const handleAddProductPromotion = async () => {
    try {
        productSelect.value.forEach(async (id) => {
            const response = await productPromotionService.create({
                promotion_id: promotionIdSelect.value,
                product_id: id,
                discount_price: (discountPercentage.value * getProductPriceById(id)) / 100
            });
            // console.log('Get product id: ', getProductPriceById(id));
            console.log(response);
            // console.log(id);
            handleFetchPromotion();
        })
        productSelect.value = [];
        categorySelect.value = '';
        showSuccess("Điều chỉnh nhóm sản phẩm thành công");
        isShowProductPromotion.value = false;
    } catch (error) {
        console.log(error.response);
    }
}


const getProductPriceById = (id) => {
    return listProduct.value.filter((data) => data.product_id == id)[0].product_price;
}

const handleProductPromotion = (promotion) => {
    promotionIdSelect.value = promotion.promotion_id;
    productPromotionSelect.value = promotion.product_promotion;
    discountPercentage.value = promotion.discount_percentage;
    isShowProductPromotion.value = !isShowProductPromotion.value
}


const handleFetchPromotion = async () => {
    try {
        const response = await promotionService.getPromotions();
        listPromotion.value = response.data;
        console.log(response);
    } catch (error) {
        console.log(error.response);
    }
}

const handleFetchPromotionByDate = async () => {
    try {
        const response = await promotionService.getByDate({
            start_date: startDateFilter.value,
            end_date: endDateFilter.value
        });
        listPromotion.value = response.data;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const handleSoftDelete = async (id) => {
    try {
        const response = await promotionService.sotfDelete(id);
        // console.log(response);
        showSuccess("Xóa khuyến mãi thành công");
        handleFetchPromotion();
    } catch (error) {
        console.log(error.response);
    }
}

const sortDate = () => {
    if (dateSelect.value !== null) {
        const { startDate, endDate } = getDateRange();
        console.log(`Start Date: ${startDate}\nEnd Date: ${endDate}`);
        startDateFilter.value = startDate;
        endDateFilter.value = endDate;
        handleFetchPromotionByDate();
    } else {
        handleFetchPromotion();
    }


}

watch(categorySelect, (newData) => {
    if (newData !== "") {
        fetchProductByCategoryName(newData);
    } else {
        listProduct.value = [];
    }
})


const getDateRange = () => {
    const dateString = dateSelect.value.toString();
    const commaIndex = dateString.indexOf(",");
    const startDateString = dateString.slice(0, commaIndex).trim();
    const endDateString = dateString.slice(commaIndex + 1).trim();

    // Parse the dates from input string
    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);
    // Adjust times
    startDate.setHours(0, 0, 0, 0); // Set start date to 00:00:00
    endDate.setHours(23, 59, 59, 999); // Set end date to 23:59:59

    // Convert to ISO string and adjust for timezone offset
    const offsetStart = startDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const offsetEnd = endDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const isoStartDate = new Date(
        startDate.getTime() - offsetStart
    ).toISOString();
    const isoEndDate = new Date(endDate.getTime() - offsetEnd).toISOString();

    return {
        startDate: isoStartDate,
        endDate: isoEndDate,
    };
};


const endDataPromotion = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return listPromotion.value.slice(startIndex, startIndex + pageSize);
})


onMounted(() => {
    handleFetchPromotion();
    fetchListCategory();
})

const handleInput = () => {
    if (promotionData.value.discountPercentage < 0) {
        promotionData.value.discountPercentage = 0;
    } else if (promotionData.value.discountPercentage > 100) {
        promotionData.value.discountPercentage = 100;
    }
};


const handleInputUpdate = () => {
    if (currentDataPromotion.value.discount_percentage < 0) {
        currentDataPromotion.value.discount_percentage = 0;
    } else if (currentDataPromotion.value.discount_percentage > 100) {
        currentDataPromotion.value.discount_percentage = 100;
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
    margin-left: 993px;
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