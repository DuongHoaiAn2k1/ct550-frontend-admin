<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">DANH MỤC</h1>
        <ol class="breadcrumb mb-4">
          <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Thêm (+)
          </button>
        </ol>
        <!-- Button trigger modal -->

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="font-weight: 600">
                  Thêm danh mục
                </h1>

                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form @submit="handleCreate">
                <div class="modal-body text-center">
                  <h5 style="font-weight: 600">Tên danh mục</h5>
                  <input name="category_name" type="text" v-model="dataCreate.category_name" />
                  <p>
                    <span class="text-danger">{{ categoryNameError }}</span>
                  </p>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Đóng
                  </button>
                  <button type="submit" class="btn btn-dark">Thêm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-header">
            <i class="fas fa-table me-1"></i>
          </div>
          <div class="card-body">
            <div class="form-group pull-right contain-search">
              <input type="text" class="search form-control form-design" placeholder="Nhập từ khóa tìm kiếm"
                v-model="search" />
            </div>
            <span class="counter pull-right"></span>
            <table class="table table-hover table-bordered results">
              <thead>
                <tr>
                  <th>STT</th>
                  <th class="col">Tên danh mục</th>
                  <th class="col">Thời gian tạo</th>
                  <th class="col">Thời gian cập nhật</th>
                  <th class="col"></th>
                  <th class="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(category, index) in datasearch" :key="category.category_id">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>
                    <input type="text" v-model="category.category_name" :readonly="index !== editingIndex"
                      :class="{ 'design-input': index !== editingIndex }" />
                  </td>
                  <td>{{ convertTime(category.created_at) }}</td>
                  <td>{{ convertTime(category.updated_at) }}</td>
                  <td>
                    <button type="button" class="btn btn-sm btn-secondary design-button" @click="handleEdit(index)">
                      Edit
                    </button>
                  </td>
                  <td>
                    <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" width="200"
                      confirm-button-type="danger" title="Bạn có muốn xóa?"
                      @confirm="handleDelete(category.category_id)" @cancel="cancelEvent">
                      <template #reference>
                        <el-button v-show="index !== editingIndex" type="danger">Delete</el-button>
                      </template>
                    </el-popconfirm>
                    <button v-show="index === editingIndex" type="button" class="btn btn-sm btn-success"
                      @click="handleUpdate(category)">
                      Update
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-end">
              <el-pagination v-model:current-page="currentPage" @current-change="handleCurrentChange" small background
                layout="prev, pager, next" :total="Math.ceil(categoryStore.length / pageSize) * 10" class="mt-4" />
            </div>
            <div v-show="datasearch.length == 0">
              <p class="text-center">Không có danh mục nào</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useCategoryStore } from "../stores/category";
import { convertTime } from "../helpers/UtilHelper";
import { createCategory, updateCategory, deleteCategory } from "../utils/categoryUtils";
import { showLoading } from "../helpers/LoadingHelper";
import * as Yup from "yup";
const categoryStore = useCategoryStore();

const currentPage = ref(1);
const pageSize = 8;


const schema = Yup.object().shape({
  category_name: Yup.string().required("Tên danh mục không được để trống"),

});
const search = ref("");
const editingIndex = ref(null);
const dataCreate = reactive({
  category_name: "",
  category_img: "",
});

onMounted(async () => {
  await categoryStore.fetchListCategory();
});

const datasearch = computed(() => {
  const dataSearch = String(search.value).trim();
  const startIndex = (currentPage.value - 1) * pageSize;
  const listCategory = categoryStore.getListCategory;
  if (!dataSearch) {
    return listCategory.slice(startIndex, startIndex + pageSize);
  }

  return listCategory.filter((data) => {
    return String(data.category_name)
      .toLowerCase()
      .includes(dataSearch.toLowerCase());
  });
});

const handleEdit = (index) => {
  // console.log(category.category_id);
  if (editingIndex.value === index) {
    editingIndex.value = null;
  } else {
    editingIndex.value = index;
  }
};

// Hanlde update category
const handleUpdate = async (category) => {
  const loading = showLoading();
  try {
    await updateCategory(category.category_id, category);
    await categoryStore.fetchListCategory();
  } catch (error) {
    console.error('Error updating category:', error);
  } finally {
    loading.close();
  }
};


//Hanlde delete category
const handleDelete = async (category_id) => {
  const loading = showLoading();
  try {
    await deleteCategory(category_id);
    await categoryStore.fetchListCategory();
  } catch (error) {
    console.error('Error deleting category:', error);
  } finally {
    loading.close();
  }
};

const categoryNameError = ref(null);

// Hanlde create new category
const handleCreate = async (event) => {
  event.preventDefault();
  categoryNameError.value = null;

  try {
    await schema.validate(dataCreate, { abortEarly: false });
    console.log(dataCreate);

    const loading = showLoading();
    await createCategory(dataCreate);
    await categoryStore.fetchListCategory();
    loading.close();
  } catch (errors) {
    errors.inner.forEach((error) => {
      if (error.path === "category_name") {
        categoryNameError.value = error.message;
      }
    });
  }
};


const handleCurrentChange = (val) => {
  currentPage.value = val;
  console.log(`current page: ${val}`);
};
</script>

<style scoped>
.contain-search {
  display: flex;
}

.form-design {
  width: 220px;
  /* margin-left: 993px; */
  margin-left: 1160px;
}

.design-input {
  border: none;
}

.design-button {
  padding: 4px 16px;
}
</style>