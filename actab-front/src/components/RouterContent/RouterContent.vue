<template>
  <div class="router-view">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLoadingBar } from "naive-ui";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "RouterContent",
  setup() {
    // Set loading bar
    const loadingBar = useLoadingBar();
    const router = useRouter();
    router.beforeEach((_to, _from, next) => {
      loadingBar.start();
      next();
    });
    router.afterEach((_to, _from, failure) => {
      if (failure) {
        loadingBar.start();
        loadingBar.error();
      } else {
        loadingBar.finish();
      }
    });
    // Done
    return {};
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./style.scss" lang="scss" scope></style>
