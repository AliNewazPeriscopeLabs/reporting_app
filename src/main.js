import { createApp } from 'vue'
import { VueCookieNext } from 'vue-cookie-next'
import App from './App.vue'
import router from './router'
import './utils/axios';
// bootstrap javascript
import 'bootstrap'


// bootstrap style
import 'bootstrap/scss/bootstrap.scss'
import '@/assets/custom.scss'
const app = createApp(App);

app.use(VueCookieNext);
app.use(router).mount('#app');
