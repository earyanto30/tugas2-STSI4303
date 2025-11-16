import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TemperaturePage from "../views/TemperaturePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/data-temperature",
  },
  {
    path: "/data-temperature",
    name: "DataTemperature",
    component: TemperaturePage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
