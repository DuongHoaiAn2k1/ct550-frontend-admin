<template>
    <div class="notification-list-wrapper">
        <div class="notification-list" :class="{ 'scrollable': isAllShown }">
            <div class="text-center" v-show="notificationStore.length == 0">Không có thông báo</div>
            <div class="notification" :class="notification.is_admin_read ? 'notifcation-default' : 'notification-read'"
                v-for="notification in notificationsToShow" :key="notification.id">
                <span class="avatar"><i class="fa-solid fa-circle-exclamation"></i></span>
                <div class="notification-content">
                    <p style="font-size: 14px;">
                        <strong>{{ getNotificationMessage(notification.route_name) }}</strong>&nbsp;
                        <span>{{ getSubNotification(notification.route_name) }}&nbsp;{{
                            convertTime(notification.created_at) }} </span>&nbsp;
                        <router-link :to="{ name: notification.route_name }">Đi đến</router-link>
                    </p>
                </div>
            </div>
        </div>
        <!-- Nút để chuyển đổi giữa hiển thị giới hạn và tất cả thông báo -->
        <button class="toggle-btn" @click="toggleNotifications">
            {{ isAllShown ? 'Thu gọn' : 'Xem tất cả' }}
        </button>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useNotificationStore } from '../../stores/notification';
import { convertTime } from '@/helpers/UtilHelper';
const notificationStore = useNotificationStore();

const isAllShown = ref(false);

const notificationsToShow = computed(() => {
    return isAllShown.value ? notificationStore.notifications : notificationStore.notifications.slice(0, 5);
});


const toggleNotifications = () => {
    isAllShown.value = !isAllShown.value;


};

const notificationOptions = {
    'order': {
        message: 'Có đơn hàng mới',
        sub: 'Đơn hàng được tạo vào lúc'
    }
}

const getNotificationMessage = (routeName) => {
    return notificationOptions[routeName]?.message || 'Thông báo không xác định';
};


const getSubNotification = (routeName) => {
    return notificationOptions[routeName]?.sub || 'Thông báo không xác định';
}

onMounted(async () => {
    await notificationStore.getAll();
});
</script>

<style scoped>
.notification-list-wrapper {
    width: 300px;
    /* border: 1px solid #e1e4e8; */
    border: 1px solid #99c5ff;

    border-radius: 6px;
    background-color: #ffffff;
    padding: 10px;
    position: relative;
    /* Đặt vị trí tương đối để chứa nút cố định */
}

.notification-list {
    max-height: 300px;
    /* Đặt chiều cao tối đa để kích hoạt cuộn */
    overflow-y: auto;
    /* Cho phép cuộn dọc khi chiều cao nội dung vượt quá chiều cao tối đa */
    margin-bottom: 50px;
    /* Tạo khoảng trống cho nút cố định */
}

.notification {
    display: flex;
    align-items: center;
    padding: 10px;
    /* border-bottom: 1px solid #e1e4e8; */
    border-bottom: 1px solid #a5b8d2;

}

.notification-read {
    background-color: #eac6c6;

}

.notification-default {
    background-color: #fff;

}

.notification:hover {
    background-color: #c2c9ce;
}

.notification:last-child {
    border-bottom: none;
}

.avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
}

.notification-content {
    flex: 1;
}

.notification-content p {
    margin: 0;
}

.notification-content a {
    color: #0366d6;
    text-decoration: none;
}

.notification-content .time {
    display: block;
    font-size: 12px;
    color: #586069;
}

.toggle-btn {
    width: 95%;
    padding: 2px;
    border: none;
    background-color: #000;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    position: absolute;
    /* Đặt vị trí cố định cho nút */
    bottom: 10px;
    /* Cố định nút ở phía dưới cùng của container */
    left: 10px;
    /* Canh nút sang trái với khoảng cách 10px */
}

.toggle-btn:hover {
    background-color: #333;
}
</style>
