import { defineStore } from "pinia";
import userService from "@/services/user.service";

export const useUserStore = defineStore("user", {
    state: () => ({
        //Customer
        listUser: [],
        length: 0
    }),
    actions: {
       async fetchListUser() {
            try {
                const response = await userService.getListUser();
                this.listUser = response.data;
                this.length = response.data.length;
                // console.log("List user ref store: ", this.listUser);
                console.log("Fetch List user from store: ", response);
            } catch (error) {
                console.error('Failed to fetch users:', error.response);
            }
        },

        async fetchListUserByRole(role) {
            try {
                const response = await userService.getListUserByRole(role);
                this.listUser = response.data;
            } catch (error) {
                console.error('Failed to fetch users:', error.response);
            }
        },
    },
});