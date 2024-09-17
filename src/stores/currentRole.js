import {defineStore} from "pinia";
import Cookies from 'js-cookie';

export const useCurrentRole = defineStore("currentRole", {
    state: () => ({
        currentRole:  Cookies.get("currentRole") || "staff"
    }),
    actions: {
        setCurrentRole(role) {
            this.currentRole = role,
            Cookies.set("currentRole", role, { expires: 7 });
        },

        getCurrentRole() {
            return this.currentRole
        }
    }
});