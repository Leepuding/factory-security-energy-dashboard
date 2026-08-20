import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import "./styles.css";
import "./upload.css";
import "./admin.css";
import "./chat.css";
import "./insights.css";
import "./final-theme.css";

createApp(App).use(createPinia()).use(ElementPlus).mount("#document-analysis-app");
