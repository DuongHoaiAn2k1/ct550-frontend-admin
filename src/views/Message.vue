<template>
    <div id="layoutSidenav_content">
        <div class="row clearfix m-0">
            <div class="col-lg-12">
                <div class="card chat-app">
                    <div id="plist" class="people-list">
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa fa-search"></i></span>
                            <input type="text" class="form-control" placeholder="Search...">
                        </div>
                        <ul class="list-unstyled chat-list mt-2 mb-0">
                            <li @click="handleActiveUser(user)" v-for="user in listUser" class="clearfix "
                                :class="{ 'active': userSelected === user }">
                                <img :src="user.avatar ? user.avatar : user.image ? 'https://dacsancamau.com/storage/' + user.image : 'https://bootdey.com/img/Content/avatar/avatar2.png'"
                                    alt="avatar" class="rounded-circle">
                                <div class="about">
                                    <div style="font-size: 13px;" class="name">{{ user.name }}</div>
                                    <div class="status"> <i class="fa fa-circle online"></i> {{ user.roles[0].name }}
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>
                    <div class="chat">
                        <div class="chat-header clearfix">
                            <div class="row">
                                <div class="col-lg-6">
                                    <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_info">
                                        <img :src="userSelected.avatar ? userSelected.avatar : userSelected.image ? 'https://dacsancamau.com/storage/' + userSelected.image : 'https://bootdey.com/img/Content/avatar/avatar2.png'"
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
                                            src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar"
                                            class="rounded-circle">
                                    </div>
                                    <div
                                        :class="{ 'message': true, 'other-message': message.sender_id != userSelected.id, 'my-message': message.sender_id === userSelected.id }">
                                        {{ message.message }}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="chat-message clearfix">
                            <div class="input-group mb-0">
                                <span class="input-group-text">📤</span>
                                <input v-model="messageSend" type="text" class="form-control"
                                    placeholder="Nhập nội dung..." @keyup.enter="handleCreateMessage">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>

import { onMounted, ref, watch, computed } from "vue";
import messageService from "../services/message.service";
import { convertTime } from "../helpers/UtilHelper"
import { initializeEcho } from "../pusher/echoConfig";
import { useAuthStore } from "@/stores/auth";
import userService from "../services/user.service";

const loading = ref(false)
const echoInstance = initializeEcho();
const listUser = ref([]);
const messages = ref([]);
const authStore = useAuthStore();
const userSelected = ref({});
const userId = computed(() => authStore.admin_id);

const messageSend = ref("");
echoInstance.channel(`chat.${userId.value}`).listen('.message.sent', async (event) => {
    // const response = await notificationStore.getAll();
    handleFetchMessageById(userSelected.value.id);
    handleFetchAllUser();
});


const handleCreateMessage = async () => {
    try {
        const response = await messageService.create({
            message: messageSend.value,
            receiver_id: userSelected.value.id
        });

        messageSend.value = "";

        console.log(messageSend.value, userSelected.value.id);

        console.log(response);

        handleFetchMessageById(userSelected.value.id);
    } catch (error) {
        console.log(error.response);
    }
}

const handleFetchAllUser = async () => {
    try {
        const response = await userService.getListUserWithRole();
        listUser.value = response.data;
        userSelected.value = listUser.value[0];
        console.log("List user ref store: ", listUser.value);
    } catch (error) {
        console.log(error.response);
    }
}

const handleFetchMessageById = async (id) => {
    try {
        const response = await messageService.get(id);
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

onMounted(() => {
    handleFetchAllUser();
});

</script>

<style scoped>
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
    width: 280px;
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px;
    z-index: 7;
}

.chat-app .chat {
    margin-left: 280px;
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