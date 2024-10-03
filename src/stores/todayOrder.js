import {defineStore} from "pinia";
import orderService from "@/services/order.service";

export const useTodayOrder = defineStore("todayOrder", {
    state: () => ({
        todayOrderList : [],
        length : 0
    }),
    actions: {
        async fetchTodayOrderList() {
            try {
                const response = await orderService.getToday();
                this.todayOrderList = response.data;
                this.length = response.length;
                console.log("Today order ref store: ", this.todayOrderList);
                console.log("Fetch Today order from store: ", response);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }
    }
});