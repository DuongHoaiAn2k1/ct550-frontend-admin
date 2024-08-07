<template>
    <div class="notification-list">
        <div class="notification" v-for="notification in notifications" :key="notification.id">
            <img :src="notification.image" class="avatar" alt="User avatar">
            <div class="notification-content">
                <p>
                    <strong>{{ notification.name }}</strong> {{ notification.action }}
                    <a href="#">{{ notification.linkText }}</a>
                </p>
                <span class="time">{{ notification.time }}</span>
            </div>
        </div>
        <button class="see-all-btn">See all notifications</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            notifications: [
                {
                    id: 1,
                    name: "Sara Salah",
                    action: "replied on the",
                    linkText: "Upload Image",
                    time: "2m",
                    image: "https://via.placeholder.com/40"
                },
                {
                    id: 2,
                    name: "Slick Net",
                    action: "start following you",
                    linkText: "",
                    time: "45m",
                    image: "https://via.placeholder.com/40"
                },
                {
                    id: 3,
                    name: "Jane Doe",
                    action: "Like Your reply on",
                    linkText: "Test with TDD",
                    time: "1h",
                    image: "https://via.placeholder.com/40"
                },
                {
                    id: 4,
                    name: "Abigail Bennett",
                    action: "start following you",
                    linkText: "",
                    time: "3h",
                    image: "https://via.placeholder.com/40"
                }
            ]
        };
    }
};
</script>

<style scoped>
.notification-list {
    width: 300px;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    background-color: #ffffff;
    padding: 10px;

}

.notification {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #e1e4e8;
}

.notification:last-child {
    border-bottom: none;
}

.avatar {
    width: 40px;
    height: 40px;
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

.see-all-btn {
    width: 100%;
    padding: 10px;
    border: none;
    background-color: #0366d6;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    margin-top: 10px;
}

.see-all-btn:hover {
    background-color: #0356b0;
}
</style>