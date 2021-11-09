<template>
  <div class="container">
    <div class="container-card">
      <router-header :list="[...routeTitle]" />
      <n-card>
        <div class="card-title-container-se">
          <div class="main-title-se">
            <span>Sessions</span>
          </div>
          <div class="main-search-se">
            <!-- <n-input-group>
              <n-input size="small" />
              <n-button type="primary" size="small">Search</n-button>
            </n-input-group> -->
            <n-icon class="refresh-icon-se" @click="refreshSessionData">
              <IosRefresh />
            </n-icon>
          </div>
        </div>
        <el-scrollbar always>
          <div class="session-tab">
            <n-data-table
              class="session-tab-scroll"
              :loading="sessionLoading"
              :columns="sessionColums"
              :data="sessionData"
              :pagination="sessionTabPagination"
            />
          </div>
        </el-scrollbar>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, h, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NButton } from "naive-ui";
import { Apis } from "@/utils";
import RouterHeader from "@/components/RouterHeader/RouterHeader.vue";
import { RefreshSharp as IosRefresh } from "@vicons/material";

export default defineComponent({
  name: "Sessions",
  components: { RouterHeader, IosRefresh },
  setup() {
    // Common Resource
    const route = useRoute();
    const router = useRouter();
    const routeTitle: Ref<Array<string>> = ref([]);
    if (typeof route.meta.title === "string") {
      routeTitle.value.push(route.meta.title);
      routeTitle.value.push("All");
    }
    // Requests
    const sessionLoading = ref(false);
    const sessionData: Ref<any> = ref([]);
    function refreshSessionData() {
      if (sessionLoading.value === false) {
        sessionLoading.value = true;
        Apis.common.requestAllSessions().then(data => {
          sessionData.value = data.data;
          sessionLoading.value = false;
        });
      }
    }
    refreshSessionData();
    const sessionColums = ref([
      {
        title: "Date",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                const date = new Date(row.Date);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
              }
            }
          );
        }
      },
      {
        title: "UUID",
        render(row: any) {
          return h(
            NButton,
            {
              // color: "#18a085",
              // text: true,
              size: "tiny",
              onClick: () => {
                router.push({
                  name: "sessionsDetail",
                  params: { uuid: row.UUID }
                });
              }
            },
            { default: () => row.UUID }
          );
        }
      },
      { title: "Server", key: "ServerName" },
      { title: "Track Name", key: "TrackName" },
      { title: "Type", key: "Type" },
      { title: "Track Config", key: "TrackConfig" },
      { title: "Duration Secsonds", key: "DurationSecs" },
      { title: "Race Laps", key: "RaceLaps" }
    ]);
    const sessionTabPagination = reactive({
      pageSize: 15
    });
    // Done
    return {
      routeTitle,
      sessionColums,
      sessionData,
      sessionTabPagination,
      sessionLoading,
      refreshSessionData
    };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./index.scope.scss" lang="scss" scope></style>
