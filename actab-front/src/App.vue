<template>
  <n-loading-bar-provider>
    <!-- Nav -->
    <div class="nav-bar" :style="navStyle">
      <div class="nav-container">
        <!-- Logo (128 * 48) -->
        <a class="nav-logo" href="#">
          <n-skeleton v-if="logoLoading" class="nav-logo nav-logo-skeleton" />
          <img
            src="./assets/web-logo.png"
            alt="AC logo"
            class="nav-logo"
            :onload="(logoLoading = false)"
          />
        </a>
        <!-- Route menu -->
        <div class="nav-bar-right">
          <!-- Menu -->
          <n-skeleton v-if="loading" class="route-menu-skeleton route-menu" />
          <n-menu
            v-else
            class="route-menu"
            mode="horizontal"
            v-model:value="routeMenuKey"
            :options="filtedRoutes"
          ></n-menu>
          <!-- Drawer -->
          <n-drawer
            class="route-menu-drawer"
            v-model:show="drawerMenuFlag"
            placement="top"
          >
            <n-drawer-content>
              <div style="text-align: center;">AcTab</div>
              <n-menu
                v-model:value="routeMenuKey"
                :options="filtedRoutes"
                @update:value="drawerMenuFlag = false"
              ></n-menu>
            </n-drawer-content>
          </n-drawer>
          <div class="nav-drawer-button">
            <n-icon size="24">
              <menu-icon
                class="mobile"
                @click="drawerMenuFlag = !drawerMenuFlag"
              />
            </n-icon>
          </div>
        </div>
      </div>
    </div>
    <!-- Router view -->
    <router-content />
    <!-- Footer -->
    <div class="container text-center footer">
      <p class="sub-text">
        Open source on
        <a href="https://github.com/Kenhuey/mas.actab.v1" target="_blank"
          >GitHub</a
        >.
        <br />
        Following
        <a
          href="https://github.com/Kenhuey/mas.actab.v1/blob/main/LICENSE"
          target="_blank"
          >GNU General Public License v3.0</a
        >.
        <br />
        Copyright &copy;
        {{ new Date().getFullYear() > 2021 ? "2021 - " : "" }}
        {{ new Date().getFullYear() }} MythsArt Studio. All Rights Reserved.
        <br />
        kenhuey@qq.com | ac.mythsart.com
      </p>
    </div>
    <!-- Route Sub Menu Check -->
    {{ updateSubMenu() }}
  </n-loading-bar-provider>
</template>

<script lang="ts">
import RouterContent from "@/components/RouterContent/RouterContent.vue";
import { defineComponent, ref, nextTick, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getMenuRoutes } from "./router";
import { Menu as MenuIcon } from "@vicons/carbon";

const menuRoutes = getMenuRoutes();

function filtRoutes() {
  let result = [];
  for (let i = 0; i < menuRoutes.length; i += 1) {
    if (!menuRoutes[i].ignoreMenu) {
      result.push(menuRoutes[i]);
    }
  }
  return result;
}

export default defineComponent({
  components: { RouterContent, MenuIcon },
  setup() {
    // Common resources
    const logoLoading = ref(true);
    const loading = ref(true);
    const drawerMenuFlag = ref(false);
    const navStyle = ref({ boxShadow: "none" });
    function whenScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop !== 0) {
        navStyle.value.boxShadow = "0px 2px 8px 0px rgba(30, 30, 30, 0.1)";
      } else {
        navStyle.value.boxShadow = "none";
      }
    }
    // On mounted
    onMounted(() => {
      // Scroll
      window.addEventListener("scroll", whenScroll);
    });
    // Get current url path and sync nav menu
    const router = useRouter();
    const currentUrl = ref();
    router.afterEach(to => {
      currentUrl.value = to.name;
    });
    // Get filted routes
    const filtedRoutes = filtRoutes();
    // Menu jump
    const route = useRoute();
    function updateSubMenu() {
      if (route.meta["menuKey"] !== undefined) {
        currentUrl.value = route.meta["menuKey"];
      }
    }
    // Dom finish
    nextTick(() => {
      loading.value = false;
    });
    // Done
    return {
      logoLoading,
      loading,
      drawerMenuFlag,
      routeMenuKey: currentUrl,
      filtedRoutes,
      navStyle,
      updateSubMenu
    };
  }
});
</script>

<style src="@/styles/app.scss" lang="scss"></style>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="@/styles/app.scope.scss" lang="scss" scope></style>
