import { defineStore } from "pinia";
import roleService from "@/services/role.service";

export const useRoleStore = defineStore("role", {
    state: () => ({
        listRole: [],
    }),
    actions: {
        async fetchListRole() {
            try {
                const response = await roleService.getRoles();
                this.listRole = response.data;
                console.log("List role: ", response);
            } catch (error) {
                console.log(error);
            }
        },
    },
});