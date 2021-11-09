import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import naive from "naive-ui";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App)
  .use(store)
  .use(router)
  .use(naive)
  .use(ElementPlus)
  .mount("#app");
