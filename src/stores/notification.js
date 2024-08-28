import { defineStore } from "pinia";
import notificationService from "@/services/notification.service";

export const useNotificationStore = defineStore("notification", {
    state: () => ({
        notifications: [],
        length: 0,
        count_unread: 0,
    }),
    actions: {
        async getAll() {
           const response = await notificationService.getAll();
        //    console.log(response);
           this.notifications = response.data;
           this.length = response.data.length;
           this.count_unread = response.count_unread;
        },
    },
});