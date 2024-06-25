// src/router/routes.js
import HomePage from "pages/HomePage.vue";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: HomePage }],
  },
  // Always leave this as last one
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
