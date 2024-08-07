import { ElLoading } from "element-plus";

const showLoading = (text = "Đang xử lý...", background = "rgba(0,0,0, 0.7)") => {
  return ElLoading.service({
    lock: true,
    text: text,
    background: background,
  });
};

export { showLoading };
