import { ElNotification } from "element-plus";
import { ElMessage } from "element-plus";

function showSuccess(message) {
  ElNotification({
    title: "Success",
    message: message,
    type: "success",
  });
}

function showWarning(message) {
  ElNotification({
    title: "Warning",
    message: message,
    type: "warning",
  });
}

function showError(message) {
  ElNotification({
    title: "Error",
    message: message,
    type: "error",
  });
}


function showInfo(message) {
  ElNotification({
    title: "Info",
    message: message,
    type: "info",
  });
}

const showSuccessMessage = (message) => {
  ElMessage({
    message: message,
    type: "success",
  });
};
export { showSuccess, showWarning, showError, showInfo, showSuccessMessage };
