import { ElNotification } from "element-plus";

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
export { showSuccess, showWarning, showError };
