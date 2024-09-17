import { defineStore } from "pinia";
import Cookies from 'js-cookie';

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    isAdminLoggedIn: JSON.parse(
      Cookies.get("isAdminLoggedIn") || false
    ),
    accessToken: Cookies.get("access_token") || null,
    refresh_token: Cookies.get("refresh_token") || null,
    admin_id: Cookies.get("admin_id"),
  }),
  actions: {
    login(accessToken, refresh_token, admin_id, role) {
      localStorage.setItem("processRefreshToken", false);
      this.isAdminLoggedIn = true;
      this.accessToken = accessToken;
      this.refresh_token = refresh_token;
      this.admin_id = admin_id;
      Cookies.set("admin_id", admin_id, { expires: 7 });
      Cookies.set("isAdminLoggedIn", true, { expires: 7 });
      Cookies.set("access_token", accessToken, { secure: true, expires: 7 });
      Cookies.set("refresh_token", refresh_token, { secure: true, expires: 7 });
      Cookies.set("role", role, { expires: 7 });
    },

    logout() {
      this.isAdminLoggedIn = false;
      this.accessToken = null;
      this.refresh_token = null;
      Cookies.set("isAdminLoggedIn", false);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("admin_id");
      Cookies.remove("role");
    },
  },
});
