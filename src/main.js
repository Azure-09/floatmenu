import { createApp } from "vue";
import App from "./App.vue";
import { Tooltip, Button } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

createApp(App).use(Tooltip).use(Button).mount('#app');