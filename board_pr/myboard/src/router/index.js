import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BoardView from "../views/BoardView.vue";
import WriteView from "../views/WriteView.vue"; //게시판 리스트 컴포넌트 호출
import DetailView from "../views/DetailView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/board",
    name: "board",
    component: BoardView,
  },
  {
    path: "/board/write",
    name: "write",
    component: WriteView,
  },
  {
    path: "/board/view", //상세페이지 추가
    name: "view",
    component: DetailView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
