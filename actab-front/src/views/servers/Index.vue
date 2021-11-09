<template>
  <div class="container">
    <div class="container-card">
      <router-header :list="[...routeTitle]" />
      <n-card>
        <div class="card-title-container-s title-padding-bottom">
          <div class="main-title-s">
            Servers
          </div>
          <div class="container-online-statu">
            <span class="online-server-text-span">3 Server(s) Online</span>
            <n-badge type="success" dot />
          </div>
        </div>
        <n-select :options="testOptions" class="title-padding-bottom" />
        <!-- <div class="">
          <router-view />
        </div> -->
      </n-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import RouterHeader from "@/components/RouterHeader/RouterHeader.vue";

const testOptions = [
  {
    label: "Test"
  }
];

export default defineComponent({
  name: "Servers",
  components: { RouterHeader },
  setup() {
    // Common Resource
    const route = useRoute();
    const routeTitle: Ref<Array<string>> = ref([]);
    if (typeof route.meta.title === "string") {
      routeTitle.value.push(route.meta.title);
      routeTitle.value.push("All");
    }
    // Done
    return { routeTitle, testOptions };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./index.scope.scss" lang="scss" scope></style>
