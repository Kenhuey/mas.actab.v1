<template>
  <n-card style="margin:0 auto;">
    <n-result status="error" title="404" description="Not Found">
      <template #footer>
        Got lost my sweety?
      </template>
    </n-result>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import { useLoadingBar } from "naive-ui";

export default defineComponent({
  name: "RouterContent",
  setup() {
    // Set loading bar
    const loadingBar = useLoadingBar();
    nextTick(() => {
      loadingBar.start();
      loadingBar.error();
    });
    // Done
    return {};
  }
});
</script>
