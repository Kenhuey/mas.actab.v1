import { createRouter, createWebHistory } from "vue-router";
import { nextTick, h, resolveComponent } from "vue";
import { renderIcon } from "@/utils";
import {
  UserMultiple,
  Home,
  AiResults,
  AlignBoxTopCenter,
  User,
} from "@vicons/carbon";

const mainRoutes: any = [
  {
    path: "/",
    name: "overview",
    meta: { title: "Overview" },
    component: () => import("../views/overview/Index.vue"),
    menuOptions: {
      label: () =>
        h(
          resolveComponent("router-link"),
          {
            to: {
              name: "overview",
            },
          },
          () => "Overview"
        ),
      key: "overview",
      icon: renderIcon(Home),
      ignoreMenu: false,
    },
  },
  {
    path: "/players",
    name: "players",
    component: () => import("../views/players/Index.vue"),
    meta: { title: "All" },
    menuOptions: {
      label: () =>
        h(
          resolveComponent("router-link"),
          {
            to: {
              name: "players",
            },
          },
          () => "Players"
        ),
      key: "playersMenu",
      icon: renderIcon(User),
      ignoreMenu: false,
      children: [
        {
          label: () =>
            h(
              resolveComponent("router-link"),
              {
                to: {
                  name: "players",
                },
              },
              () => "All Players"
            ),
          key: "players",
          icon: renderIcon(UserMultiple),
        },
      ],
    },
  },
  {
    path: "/players/profile/:uuid",
    name: "playerProfile",
    meta: { title: "Profile", menuKey: "playersMenu" },
    component: () => import("../views/players/profile/Index.vue"),
    menuOptions: {
      ignoreMenu: true,
    },
  },
  {
    path: "/sessions",
    name: "sessions",
    meta: { title: "Sessions" },
    component: () => import("../views/sessions/Index.vue"),
    menuOptions: {
      label: () =>
        h(
          resolveComponent("router-link"),
          {
            to: {
              name: "sessions",
            },
          },
          () => "Sessions"
        ),
      key: "sessionsMenu",
      ignoreMenu: false,
      icon: renderIcon(AiResults),
      children: [
        {
          label: () =>
            h(
              resolveComponent("router-link"),
              {
                to: {
                  name: "sessions",
                },
              },
              () => "All sessions"
            ),
          key: "sessions",
          // icon: renderIcon(UserMultiple),
        },
      ],
    },
  },
  {
    path: "/sessions/detail/:uuid",
    name: "sessionsDetail",
    meta: { title: "Detail", menuKey: "sessionsMenu" },
    component: () => import("../views/sessions/detail/Index.vue"),
    menuOptions: {
      ignoreMenu: true,
    },
  },
  {
    path: "/servers",
    name: "servers",
    meta: { title: "Servers" },
    component: () => import("../views/servers/Index.vue"),
    menuOptions: {
      label: () =>
        h(
          resolveComponent("router-link"),
          {
            to: {
              name: "servers",
            },
          },
          () => "Servers"
        ),
      key: "servers",
      ignoreMenu: false,
      icon: renderIcon(AlignBoxTopCenter),
    },
  },
];

const catcherRoutes = [
  {
    path: "/statu/404",
    name: "statu404",
    meta: { title: "404 Not Found" },
    component: () => import("../views/status/404/404.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/statu/404",
  },
];

export function getRoutes(): any {
  const targetRoutes = [];
  for (let i = 0; i < mainRoutes.length; i += 1) {
    const targetRoute = {
      path: mainRoutes[i].path,
      name: mainRoutes[i].name,
      meta: mainRoutes[i].meta,
      children: mainRoutes[i].children,
      component: mainRoutes[i].component,
    };
    targetRoutes.push(targetRoute);
  }
  return targetRoutes;
}

export function getMenuRoutes(): any {
  const targetMenuRoutes = [];
  for (let i = 0; i < mainRoutes.length; i += 1) {
    if (
      mainRoutes[i].menuOptions.ignoreMenu === undefined ||
      mainRoutes[i].menuOptions.ignoreMenu === false
    ) {
      const targetMenuRoute = {
        label: mainRoutes[i].menuOptions.label,
        icon: mainRoutes[i].menuOptions.icon,
        key: mainRoutes[i].menuOptions.key,
        children: mainRoutes[i].menuOptions.children,
      };
      targetMenuRoutes.push(targetMenuRoute);
    }
  }
  return targetMenuRoutes;
}

const routes = [...getRoutes(), ...catcherRoutes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Set title
router.afterEach((to) => {
  nextTick(() => {
    if (typeof to.meta.title === "string" && to.meta.title) {
      document.title = `${to.meta.title} - AcTab`;
    }
  });
});

export default router;
