<template>
  <n-page-header class="router-header-main">
    <template #header>
      <n-breadcrumb>
        <n-breadcrumb-item>
          <n-icon @click="router.push('/')"> <home /> </n-icon>
        </n-breadcrumb-item>
        <n-breadcrumb-item
          v-for="(item, index) in getRoutesName(list)"
          :key="index"
          ><n-ellipsis>{{ item }}</n-ellipsis></n-breadcrumb-item
        >
      </n-breadcrumb>
    </template>
  </n-page-header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { Home } from "@vicons/carbon";

function getRoutesName(list: Array<string>) {
  if (list === [] || list === undefined || list.length === 0) {
    return ["Unknown"];
  }
  return list;
}

export default defineComponent({
  name: "RouterHeader",
  props: {
    list: { default: ["Unknown"] }
  },
  components: {
    Home
  },
  setup() {
    // Common resources
    const router = useRouter();
    // Done
    return { router, getRoutesName };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./style.scss" lang="scss" scope></style>
