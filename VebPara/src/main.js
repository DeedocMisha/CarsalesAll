import './assets/main.css'
import App from './App.vue';
import router from '@/router'
import { createApp } from 'vue'
import '../src/assets/sass.scss';

const app= createApp(App)
app.use(router)
app.mount('#app');