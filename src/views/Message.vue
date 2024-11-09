<template>
    <div id="layoutSidenav_content">
        <div class="row clearfix m-0">
            <div class="col-lg-12">
                <div class="card chat-app">
                    <div id="plist" class="people-list">
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa fa-search"></i></span>
                            <input v-model="search" type="text" class="form-control" placeholder="Search...">
                        </div>
                        <ul class="list-unstyled chat-list mt-2 mb-0">
                            <li @click="handleActiveUser(user)" v-for="user in filterUser" class="clearfix "
                                :class="{ 'active': userSelected.id === user.id }">
                                <img :src="user.avatar ? user.avatar : user.image ? apiUrl + user.image : 'https://bootdey.com/img/Content/avatar/avatar2.png'"
                                    alt="avatar" class="rounded-circle">
                                <div class="about">
                                    <div style="font-size: 13px;" class="name">{{ user.name }}</div>
                                    <div class="status"> <i class="fa fa-circle online"></i> {{ user.roles[0].name }}
                                    </div>
                                </div>
                                <div class="float-end">
                                    <span v-show="user.unread_count_from_admin != 0 && user.id != userSelected.id"
                                        class="badge rounded-pill badge-notification bg-danger">{{
                                            user.unread_count_from_admin
                                        }}</span>
                                </div>

                            </li>
                        </ul>
                    </div>
                    <div class="chat">
                        <div class="chat-header clearfix">
                            <div class="row">
                                <div class="col-lg-6">
                                    <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_info">
                                        <img :src="userSelected.avatar ? userSelected.avatar : userSelected.image ? apiUrl + userSelected.image : 'https://bootdey.com/img/Content/avatar/avatar2.png'"
                                            class="rounded-circle">
                                    </a>
                                    <div class="chat-about">
                                        <h6 class="mb-0">{{
                                            userSelected ? userSelected.name : '' }}</h6>
                                        <small> Khách hàng </small>
                                    </div>
                                </div>
                                <div class="col-lg-6 text-end">
                                    <a href="javascript:void(0);" class="btn btn-outline-secondary"><i
                                            class="fa fa-camera"></i></a>
                                    <a href="javascript:void(0);" class="btn btn-outline-primary"><i
                                            class="fa fa-image"></i></a>
                                    <a href="javascript:void(0);" class="btn btn-outline-info"><i
                                            class="fa fa-cogs"></i></a>
                                    <a href="javascript:void(0);" class="btn btn-outline-warning"><i
                                            class="fa fa-question"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="chat-history" v-loading="loading">
                            <ul class="m-b-0 list-unstyled" style="min-height: 300px;">
                                <li v-show="!loading" v-for="message in messages" :key="message.message_id"
                                    :class="{ 'clearfix': true, 'text-end': message.sender_id != userSelected.id, 'float-end': message.sender_id != userSelected.id }">
                                    <div class="message-data"
                                        :class="{ 'text-end': message.sender_id != userSelected.id }">
                                        <span class="message-data-time">{{ convertTime(message.created_at) }}</span>
                                        <img v-if="message.sender_id != userSelected.id"
                                            src="../../public/admin/admin-img.png" alt="avatar" class="rounded-circle">
                                    </div>
                                    <div
                                        :class="{ 'message': true, 'other-message': message.sender_id != userSelected.id, 'my-message': message.sender_id === userSelected.id }">
                                        {{ message.message }}
                                    </div>
                                    <div v-if="message.products && JSON.parse(message.products).length"
                                        class="product-list-inline-container mt-2">
                                        <div class="product-list-inline d-flex flex-row-reverse">
                                            <div v-for="product in JSON.parse(message.products)"
                                                :key="product.product_id" class="card product-card me-2 mb-2"
                                                style="width: 150px;">
                                                <img :src="apiUrl + product.product_img" class="card-img-top"
                                                    alt="product image" style="height: 100px; object-fit: cover;">
                                                <div class="card-body p-2">
                                                    <h6 class="card-title text-center">{{ product.product_name }}</h6>
                                                    <p class="card-text text-muted mb-0 text-center">{{
                                                        formatCurrency(product.product_price) }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="chat-message clearfix">
                            <div v-if="selectedProducts.length" class="selected-product-preview mb-2">
                                <div class="d-flex flex-wrap">
                                    <div v-for="product in selectedProducts" :key="product.id"
                                        class="selected-product d-flex align-items-center me-3 mb-2">
                                        <img :src="apiUrl + JSON.parse(product.product_img)[0]" alt="product image"
                                            class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                        <div>
                                            <p class="mb-0" style="font-size: 12px;">{{ product.name }}</p>
                                            <el-button type="danger" @click="removeProduct(product)" :icon="Delete"
                                                circle />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mb-0">
                                <span class="input-group-text">📤</span>
                                <input v-model="messageSend" type="text" class="form-control"
                                    placeholder="Nhập nội dung..." @keyup.enter="handleCreateMessage">
                                <button @click="showProductModal = true" class="btn btn-outline-secondary">Chọn sản
                                    phẩm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showProductModal" class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chọn sản phẩm</h5>
                    <button type="button" class="btn-close" @click="showProductModal = false"
                        aria-label="Close"></button>
                </div>

                <!-- Phần lọc danh mục sản phẩm -->
                <div class="modal-body">
                    <div class="mb-3">
                        <select v-model="selectedCategory" class="form-select" @change="filterProducts">
                            <option value="">Tất cả danh mục</option>
                            <option v-for="category in listCategory" :key="category.category_id"
                                :value="category.category_id">
                                {{ category.category_name }}
                            </option>
                        </select>
                    </div>

                    <!-- Danh sách sản phẩm -->
                    <div class="product-list">
                        <div v-for="product in filteredProducts" :key="product.product_id"
                            class="d-flex align-items-center mb-3">
                            <img :src="apiUrl + JSON.parse(product.product_img)[0]" alt="product image" class="me-3"
                                style="width: 80px; height: 60px; object-fit: cover;">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">{{ product.product_name }}</h6>
                                <p class="mb-1">{{ formatCurrency(product.product_price) }}</p>
                            </div>
                            <!-- Ô chọn sản phẩm -->
                            <input type="checkbox" :value="product" v-model="selectedProducts">
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="showProductModal = false">Đóng</button>
                    <button type="button" class="btn btn-primary" @click="confirmSelection">Chọn sản phẩm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    Delete,
} from '@element-plus/icons-vue'
import { onMounted, ref, watch, computed } from "vue";
import messageService from "../services/message.service";
import { convertTime } from "../helpers/UtilHelper"
import { initializeEcho } from "../pusher/echoConfig";
import { useAuthStore } from "@/stores/auth";
import userService from "../services/user.service";
import categoryService from "../services/category.service";
import productService from "../services/product.service";
import { formatCurrency } from '../helpers/UtilHelper';
const apiUrl = import.meta.env.VITE_APP_API_URL;
const search = ref("");
const loading = ref(false)
const echoInstance = initializeEcho();
const listUser = ref([]);
const messages = ref([]);
const authStore = useAuthStore();
const userSelected = ref({});
const userId = computed(() => authStore.admin_id);
const listCategory = ref([]);
const messageSend = ref("");
const products = ref([]);
echoInstance.channel(`chat.${userId.value}`).listen('.message.sent', async (event) => {
    // const response = await notificationStore.getAll();
    handleFetchMessageById(userSelected.value.id);
    handleFetchAllUser();
    // console.log('user selected ', userSelected.value);
});

const handleCreateMessage = async () => {
    try {
        // Kiểm tra nếu có sản phẩm được chọn
        const products = selectedProducts.value.length
            ? selectedProducts.value.map(product => ({
                product_id: product.product_id,
                product_name: product.product_name,
                product_img: JSON.parse(product.product_img)[0],
                product_price: product.product_price
            }))
            : null;

        const response = await messageService.create({
            message: messageSend.value,
            receiver_id: userSelected.value.id,
            products: products // Gửi thông tin chi tiết sản phẩm
        });

        messageSend.value = "";
        selectedProducts.value = []; // Xóa danh sách sản phẩm sau khi gửi
        handleFetchMessageById(userSelected.value.id);
    } catch (error) {
        console.log(error.response);
    }
};


const fetchCategory = async () => {
    try {
        const response = await categoryService.getAll();
        listCategory.value = response.listCategory;
        // console.log("List category ref store: ", response);
    } catch (error) {
        console.log(error.response);
        throw error;
    }
}

const fetchProduct = async () => {
    try {
        const response = await productService.getAll();
        products.value = response.listProduct;
        return response;
    } catch (error) {
        console.log(error.response);
        throw error;
    }
}

const handleFetchAllUser = async () => {
    try {
        const response = await userService.getListUserWithRole();
        listUser.value = response.data;
        console.log("List user ref store: ", listUser.value);
    } catch (error) {
        console.log(error.response);
    }
}

const handleFetchMessageById = async (id) => {
    try {
        const response = await messageService.get(id);
        await messageService.adminReadMessage(id);
        messages.value = response.data;
        console.log("List message ref store: ", messages.value);
    } catch (error) {
        console.log(error.response);
    }
}

const handleActiveUser = (user) => {
    console.log(user);
    userSelected.value = user;
}

watch(userSelected, (newData) => {
    if (newData) {
        loading.value = true;
        handleFetchMessageById(newData.id);
        setTimeout(() => {
            loading.value = false
        }, 500);
    }
});

const filterUser = computed(() => {
    const searchKey = String(search.value).trim();
    return listUser.value.filter((data) => {
        return String(data.name).toLowerCase().includes(searchKey.toLowerCase());
    })
});

onMounted(() => {
    handleFetchAllUser().then(() => {
        userSelected.value = listUser.value[0];
    })
    fetchCategory();
    fetchProduct();
});

const showProductModal = ref(false);
const selectedCategory = ref("");
const selectedProducts = ref([]);


// Lọc sản phẩm theo danh mục
const filteredProducts = computed(() => {
    if (!selectedCategory.value) return products.value;
    return products.value.filter(product => product.category_id === selectedCategory.value);
});

// Xác nhận lựa chọn sản phẩm
const confirmSelection = () => {
    console.log("Sản phẩm đã chọn:", selectedProducts.value);
    showProductModal.value = false;
};

const removeProduct = (product) => {
    selectedProducts.value = selectedProducts.value.filter(p => p.product_id !== product.product_id);
};

</script>

<style scoped>
.product-list {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 10px;
}

/* Đảm bảo container của danh sách sản phẩm nằm sát bên phải */
.product-list-inline-container {
    display: flex;
    justify-content: flex-end;
    /* Đẩy toàn bộ phần product-list-inline sang bên phải */
}

/* Thiết lập flex cho product-list-inline */
.product-list-inline {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    max-width: 100%;
    gap: 10px;
}

/* Đảm bảo các thẻ sản phẩm có chiều rộng cố định */
.product-list-inline .product-card {
    flex: 0 0 auto;
}

.product-list-inline::-webkit-scrollbar {
    height: 8px;
}

.product-list-inline::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
}

.product-list-inline::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

.card {
    background: #fff;
    transition: .5s;
    border: 0;
    margin-bottom: 30px;
    border-radius: .55rem;
    position: relative;
    width: 100%;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
}

.chat-app .people-list {
    width: 320px;
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px;
    z-index: 7;
}

.chat-app .chat {
    margin-left: 320px;
    border-left: 1px solid #333
}

.people-list {
    -moz-transition: .5s;
    -o-transition: .5s;
    -webkit-transition: .5s;
    transition: .5s
}

.people-list .chat-list li {
    padding: 10px 15px;
    list-style: none;
    border-radius: 3px
}

.people-list .chat-list li:hover {
    background: #efefef;
    cursor: pointer
}

.people-list .chat-list li.active {
    background: #ede4e4
}

.people-list .chat-list li .name {
    font-size: 15px
}

.people-list .chat-list img {
    width: 45px;
    border-radius: 50%
}

.people-list img {
    float: left;
    border-radius: 50%
}

.people-list .about {
    float: left;
    padding-left: 8px
}

.people-list .status {
    color: #999;
    font-size: 13px
}

.chat .chat-header {
    padding: 15px 20px;
    border-bottom: 2px solid #f4f7f6
}

.chat .chat-header img {
    float: left;
    border-radius: 40px;
    width: 40px
}

.chat .chat-header .chat-about {
    float: left;
    padding-left: 10px
}

.chat .chat-history {
    padding: 20px;
    border-bottom: 2px solid #fff;
    display: flex;
    flex-direction: column-reverse;
    /* Hiển thị tin nhắn mới nhất ở dưới cùng */
    height: 500px;
    /* Thiết lập chiều cao cho khung chat để có thể cuộn */
    overflow-y: auto;
    /* Kích hoạt cuộn dọc */
    overflow-x: hidden;
    /* Ẩn cuộn ngang nếu có */
}

.chat .chat-history ul {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column-reverse;
}

.chat .chat-history ul li {
    list-style: none;
    margin-bottom: 30px
}

.chat .chat-history ul li:last-child {
    margin-bottom: 0px
}

.chat .chat-history .message-data {
    margin-bottom: 15px
}

.chat .chat-history .message-data img {
    border-radius: 40px;
    width: 40px
}

.chat .chat-history .message-data-time {
    font-size: 12px;
    color: #434651;
    padding-left: 6px
}

.chat .chat-history .message {
    color: #444;
    padding: 18px 20px;
    line-height: 26px;
    font-size: 16px;
    border-radius: 7px;
    display: inline-block;
    position: relative
}

.chat .chat-history .message:after {
    bottom: 100%;
    left: 7%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #fff;
    border-width: 10px;
    margin-left: -10px
}

.chat .chat-history .my-message {
    background: #60d9f4;
}

.chat .chat-history .my-message:after {
    bottom: 100%;
    left: 30px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #efefef;
    border-width: 10px;
    margin-left: -10px
}

.chat .chat-history .other-message {
    background: #60d9f4;
    text-align: right
}

.chat .chat-history .other-message:after {
    border-bottom-color: #e8f1f3;
    left: 93%
}

.chat .chat-message {
    padding: 20px
}

.online,
.offline,
.me {
    margin-right: 2px;
    font-size: 8px;
    vertical-align: middle
}

.online {
    color: #86c541
}

.offline {
    color: #e47297
}

.me {
    color: #1d8ecd
}

.float-right {
    float: right
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0
}

@media only screen and (max-width: 767px) {
    .chat-app .people-list {
        height: 465px;
        width: 100%;
        overflow-x: auto;
        background: #fff;
        left: -400px;
        display: none
    }

    .chat-app .people-list.open {
        left: 0
    }

    .chat-app .chat {
        margin: 0
    }

    .chat-app .chat .chat-header {
        border-radius: 0.55rem 0.55rem 0 0
    }

    .chat-app .chat-history {
        height: 300px;
        overflow-x: auto
    }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
    .chat-app .chat-list {
        height: 650px;
        overflow-x: auto
    }

    .chat-app .chat-history {
        height: 600px;
        overflow-x: auto
    }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .chat-app .chat-list {
        height: 480px;
        overflow-x: auto
    }

    .chat-app .chat-history {
        height: calc(100vh - 350px);
        overflow-x: auto
    }
}
</style>