import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import { useAuthStore } from "./stores/auth";
import { initializeStores } from "./stores/storeInitializer";

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '61b81b31e1b968bac959',
    cluster: 'ap1',
    forceTLS: true
});

window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('Pusher connected successfully');
});

window.Echo.channel('admin-channel')
    .listen('.user.registered', (event) => {

        alert("New user registered");
    });

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(ElementPlus);

const authStore = useAuthStore();

// initializeStores();
app.mount("#app");

// createApp(App).use(router).use(pinia).use(ElementPlus).mount("#app");
