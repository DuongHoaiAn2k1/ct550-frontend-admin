<template>
  <div id="layoutSidenav_content">
    <div class="container contain-form mt-2">
      <div>
        <h1>ĐĂNG NHẬP QUẢN TRỊ</h1>
      </div>
      <form class="mt-3" @submit="handleSubmit">
        <!-- Email input -->
        <div class="form-outline mb-1">
          <label class="form-label" for="username">Tên đăng nhập</label>
          <input type="text" id="username" class="form-control" name="username" v-model="dataLogin.username" />
          <span class="text-danger">{{ userNameErrors }}</span>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-1">
          <label class="form-label" for="password">Mật khẩu</label>
          <input type="password" id="password" class="form-control" name="password" v-model="dataLogin.password" />
          <span class="text-danger">{{ passwordErrors }}</span>
        </div>

        <div>
          <p>
            <a href="#" @click="isShowForgetForm = !isShowForgetForm">Quên mật khẩu</a>
          </p>
        </div>


        <!-- Submit button -->
        <button type="submit" class="btn btn-dark btn-block mb-4">
          Đăng nhập
        </button>
      </form>
    </div>
  </div>
  <div v-show="isShowForgetForm" class="card text-center" style="width: 300px;">
    <div class="card-header h5 text-white bg-dark">Cấp lại mật khẩu</div>
    <div class="card-body px-5">
      <p class="card-text py-2">
        Điền email tài khoản của bạn để đặt lại mật khẩu. Mật khẩu mới sẽ được gửi vào email của bạn. Bạn chỉ có thể cập
        nhật mật khẩu 1 lần/tháng.
      </p>
      <div data-mdb-input-init class="form-outline">
        <input v-model="emailReset" type="email" id="typeEmail" class="form-control" />
        <span class="text-danger">{{ emailResetError }}</span>
        <label class="form-label" for="typeEmail">Email</label>
      </div>
      <a href="#" @click="handleResetPassword" data-mdb-ripple-init class="btn btn-dark w-100">Cấp lại mật khẩu</a>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import * as Yup from "yup";
import { ElLoading, ElNotification } from "element-plus";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCurrentRole } from "../stores/currentRole";
import authService from "@/services/auth.service";
import userService from "../services/user.service";
import { showWarning } from "../helpers/NotificationHelper"

const isShowForgetForm = ref(false);
const router = useRouter();
const currentRole = useCurrentRole();
const authStore = useAuthStore();
const dataLogin = reactive({
  username: "",
  password: "",
});

const emailReset = ref('');
const emailResetError = ref(null);

const schema = Yup.object().shape({
  username: Yup.string().required("Tên đăng nhập không được để trống"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(20, "Mật khẩu chỉ tối đa 20 ký tự")
    .required("Mật khẩu không được để trống"),
});

const showSuccess = (message) => {
  ElMessage({
    message: message,
    type: "success",
  });
};

const handleLogin = async (data) => {
  try {
    const response = await authService.login(data);
    showSuccess('Đăng nhập thành công');
    let access_token = response.access_token;
    let refresh_token = response.refresh_token;
    let user_id = response.user_id;
    let role = response.role;
    authStore.login(access_token, refresh_token, user_id, role);
    currentRole.setCurrentRole(role);
    setTimeout(() => {
      router.push({ name: "home" });
    }, 500);
    console.log("hi", response);
  } catch (error) {
    console.log(error.response);
  }
};

const userNameErrors = ref(null);
const passwordErrors = ref(null);

const handleSubmit = async (event) => {
  event.preventDefault();

  userNameErrors.value = null;
  passwordErrors.value = null;

  schema
    .validate(dataLogin, { abortEarly: false })
    .then(() => {
      userNameErrors.value = null;
      passwordErrors.value = null;
      const loading = ElLoading.service({
        lock: true,
        text: "Đang xử lý...",
        background: "rgba(0,0,0, 0.7)",
      });

      setTimeout(() => {
        handleLogin(dataLogin);

        //
        loading.close();
      }, 2000);
    })
    .catch((errors) => {
      errors.inner.forEach((error) => {
        if (error.path == "username") {
          userNameErrors.value = error.message;
        }
        if (error.path == "password") {
          passwordErrors.value = error.message;
        }
      });
    });
};

const resetPassword = async () => {
  try {
    if (!emailReset.value) {
      emailResetError.value = 'Email không được để trống';
      throw new Error('Validation error');
    }

    const response = await userService.resetPassword({
      email: emailReset.value
    });

    return response;

  } catch (error) {
    console.log(error.response);
    showWarning(error.response.data.message);
    throw error;
  }
};

const handleResetPassword = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Đang xử lý...",
    background: "rgba(0,0,0, 0.7)",
  });

  resetPassword()
    .then(() => {
      setTimeout(() => {
        showSuccess('Yêu cầu đã được gửi');
        loading.close();
      }, 1500);
    })
    .catch((error) => {
      loading.close();
    });
};


watch(dataLogin, (newValue) => {
  if (newValue) {
    userNameErrors.value = null;
    passwordErrors.value = null;
  }
});

watch(emailReset, (newValue) => {
  if (newValue) {
    emailResetError.value = null;
  }
});
</script>

<style>
h1 {
  font-weight: 600;
}

.contain-form {
  width: 500px;
}
</style>