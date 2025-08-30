import { createApp } from 'vue';
import App from './App.vue';
import routes from './routes'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

const app = createApp(App);
app.use(routes);
app.mount('#app');