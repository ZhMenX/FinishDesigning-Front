import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//pinia
import {createPinia} from "pinia";
import './assets/main.css'
//Vant引入组件样式
import 'vant/lib/index.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const pinia = createPinia();
const app = createApp(App);
app.use(router)
app.use(pinia)
app.use(VueAxios, axios)
app.use(ElementPlus)

app.provide('axios', app.config.globalProperties.axios) 

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
