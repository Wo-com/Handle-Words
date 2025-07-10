import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from  '@/routers/index'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// element dark 样式
import "element-plus/theme-chalk/dark/css-vars.css";
//修改  element dark css
import "./styles/element-dark.scss";


const pinia = createPinia()

createApp(App).use(pinia).use(ElementPlus).use(router).mount('#app')
