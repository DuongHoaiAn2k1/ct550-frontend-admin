<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">THỐNG KÊ ĐÁNH GIÁ</h1>

        <div class="card mb-4">
          <div class="card-header">
            <i class="fas fa-table me-1"></i>
          </div>
          <div class="card-body">
            <div class="form-group pull-right contain-search">
              <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                @change="handleSearch" v-model="search" />
            </div>
            <span class="counter pull-right"></span>
            <table class="table table-hover table-bordered results">
              <thead>
                <tr>
                  <th class="col text-center">STT</th>
                  <th class="col text-center">Tên sản phẩm</th>
                  <th class="col text-center">Hình ảnh</th>
                  <th class="col text-center">Giá</th>
                  <th class="col text-center">Điểm đánh giá trung bình</th>
                  <th class="col text-center">Số lượt đánh giá</th>
                  <th class="col text-center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in datasearch" :key="product.product_id">
                  <th scope="row" class="text-center">{{ index + 1 }}</th>
                  <td class="text-center">{{ product.product_name }}</td>
                  <td class="text-center">
                    <img :src="apiUrl +
                      JSON.parse(product.product_img)[0]
                      " alt="Hình ảnh" width="50px" />
                  </td>

                  <td class="text-center">
                    {{ formatCurrency(product.product_price) }}
                  </td>
                  <td class="text-center">
                    {{ roundToOneDecimal(product.average) }}
                    <i style="color: yellow" class="fa-solid fa-star"></i>
                  </td>

                  <td class="text-center">{{ product.total_rating }}</td>
                  <td class="text-center">
                    <el-button @click="openDialogWithReviews(product)">Xem các comment</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-end">
              <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next"
                :total="Math.ceil((search ? datasearch.length : productsLength) / pageSize) * 10" class="mt-4" />
            </div>
            <div v-show="datasearch.length === 0">
              <p class="text-center">Không có sản phẩm nào</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <el-dialog v-model="outerVisible" title="Các comment" width="800">
    <el-scrollbar height="400px">
      <ul class="list-group" v-for="data in currentReviews" :key="data.review_id">
        <li class="list-group-item">
          <div class="row">
            <div class="col-xs-10 col-md-10">
              <div>
                <a href="#">
                  {{ data.user.name }}
                  <el-rate v-model="data.rating" allow-half /></a>
                <div class="mic-info">
                  Thời gian: {{ convertTime(data.created_at) }}
                </div>
              </div>
              <div></div>
              <div class="comment-text">{{ data.comment }}</div>
            </div>
            <div class="col-xs-2 col-md-2">
              <el-tag v-show="data.reply != null" type="success">Đã trả lời</el-tag>
              <el-popconfirm confirm-button-text="Vâng" cancel-button-text="Hủy" :icon="InfoFilled" icon-color="#626AEF"
                title="Bạn có chắc?" @confirm="handleDeleteReview(data.review_id)">
                <template #reference>
                  <el-button>Xóa</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
          <el-button class="mt-1" @click="toggleReplyBox(data)"> Trả
            lời</el-button>
          <div v-show="showBoxReply === data.review_id" class="content-reply-text">
            <textarea name="" id="" cols="80" rows="8" v-model="currentReply"></textarea>
            <el-button @click="replyCommentOfUser(data.review_id)" class="mb-4">Gửi</el-button>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </el-dialog>
</template>
<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import productService from "@/services/product.service";
import * as Yup from "yup";
import { ElLoading, ElNotification } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import reviewService from "@/services/review.service";
import { initializeEcho } from "@/pusher/echoConfig";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const echoInstance = initializeEcho();
const currentPage = ref(1);
const pageSize = 8;
const productsLength = ref(0);
const outerVisible = ref(false);
const innerVisible = ref(false);
const showBoxReply = ref(0);
const currentReviews = ref([]); // Dùng để lưu trữ reviews của sản phẩm được chọn
const currentProduct = ref(null); // Dùng để lưu trữ thông tin sản phẩm hiện tại được chọn
const currentReply = ref('');

const openDialogWithReviews = (product) => {
  currentProduct.value = product;
  currentReviews.value = product.reviews; // Cập nhật reviews dựa trên sản phẩm được chọn
  outerVisible.value = true; // Mở dialog
};

echoInstance.channel("admin-channel").listen(".review-created", (e) => {
  fetchListProduct();
});

function roundToOneDecimal(num) {
  return Math.round(num * 10) / 10;
}
const showSuccess = (message) => {
  ElNotification({
    title: "Success",
    message: message,
    type: "success",
  });
};


const listProduct = ref([]);
const search = ref("");

const fetchListProduct = async () => {
  try {
    const response = await productService.getProductsWithReviews();
    listProduct.value = response.listProduct;
    productsLength.value = response.length;
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteReview = async (id) => {
  try {
    const response = await reviewService.delete(id);
    console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};
onMounted(() => {
  fetchListProduct();
});

const handleSearch = () => {
  console.log(search.value);
  console.log("cc :", datasearch.value);
};

const datasearch = computed(() => {
  const dataSearch = String(search.value).trim();
  const startIndex = (currentPage.value - 1) * pageSize;
  if (!dataSearch) {
    return listProduct.value.slice(startIndex, startIndex + pageSize);
  }

  return listProduct.value.filter((data) => {
    return String(data.product_name)
      .toLowerCase()
      .includes(dataSearch.toLowerCase());
  });
});

const handleDeleteReview = (review_id) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Đang xử lý...",
    background: "rbga(0,0,0, 0.7)",
  });

  setTimeout(() => {
    deleteReview(review_id);
    loading.close();
    outerVisible;
    outerVisible.value = false;
    showSuccess("Xóa sản đánh giá thành công");
    fetchListProduct();
  }, 2000);
};

const replyCommentOfUser = async (id) => {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: "Đang xử lý...",
      background: "rbga(0,0,0, 0.7)",
    });
    const response = await reviewService.reply(id, {
      reply: currentReply.value,
    });
    fetchListProduct().then(() => {
      const updatedProduct = listProduct.value.find(
        (product) => product.product_id === currentProduct.value.product_id
      );

      if (updatedProduct) {
        currentProduct.value = updatedProduct;
        currentReviews.value = updatedProduct.reviews;
      }
      setTimeout(() => {
        loading.close();
        showBoxReply.value = 0;
        showSuccess("Trả lời thành công");
      }, 1000);
    })

  } catch (error) {
    console.log(error.response);
  }
}

const toggleReplyBox = (data) => {
  if (showBoxReply.value === data.review_id) {
    showBoxReply.value = 0;
  } else {
    showBoxReply.value = data.review_id;
    currentReply.value = data.reply || '';
  }
};

function formatCurrency(amount) {
  // Sử dụng hàm toLocaleString để định dạng số theo ngôn ngữ và quốc gia
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const convertTime = (dateTimeString) => {
  var dateTime = moment(dateTimeString);
  dateTime.utcOffset(7);

  var formattedDateTime = dateTime.format("DD/MM/YYYY HH:mm:ss");
  return formattedDateTime;
};

// observing current page
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
</style>