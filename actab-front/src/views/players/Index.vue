<template>
  <div class="container">
    <div class="container-card">
      <router-header :list="[...routeTitle]" />
      <n-card>
        <div class="card-title-container-p">
          <div class="main-title">
            All Players
          </div>
          <!-- <div class="main-search">
            <n-input-group>
              <n-input size="small" />
              <n-button type="primary" size="small">Search</n-button>
            </n-input-group>
          </div> -->
        </div>
        <el-scrollbar always>
          <div class="player-tab player-tab-scroll">
            <n-data-table
              :columns="playerTabColums"
              :data="playerTabDatas"
              :pagination="playerTabPagination"
              :loading="loading"
            />
          </div>
        </el-scrollbar>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, reactive, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import RouterHeader from "@/components/RouterHeader/RouterHeader.vue";
import { Apis } from "@/utils";
import { NButton } from "naive-ui";

export default defineComponent({
  name: "Players",
  components: { RouterHeader },
  setup() {
    // Common Resource
    const loading = ref(true);
    const route = useRoute();
    const router = useRouter();
    const routeTitle: Ref<Array<string>> = ref([]);
    if (typeof route.meta.title === "string") {
      routeTitle.value.push("Players");
      routeTitle.value.push(route.meta.title);
    }
    const playerTabPagination = reactive({
      pageSize: 15
    });
    const playerTabColums = [
      {
        title: "Statu"
      },
      {
        title: "Nick",
        render(row: any) {
          return h(
            NButton,
            {
              size: "tiny",
              onClick: () => {
                router.push({
                  name: "playerProfile",
                  params: { uuid: row.SteamGUID }
                });
              }
            },
            {
              default: () => {
                return row.RecentNick;
              }
            }
          );
        }
      },
      {
        title: "Join Date",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                const date = new Date(row.JoinDate);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
              }
            }
          );
        }
      },
      {
        title: "Recent Online",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                const date = new Date(row.RecentOnline);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
              }
            }
          );
        }
      }
    ];
    const playerTabDatas: any = ref([]);
    // Get datas
    Apis.common.requestAllPlayer().then(res => {
      playerTabDatas.value = res.data;
      loading.value = false;
    });
    // Done
    return {
      routeTitle,
      playerTabPagination,
      playerTabColums,
      playerTabDatas,
      loading
    };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./index.scope.scss" lang="scss" scope></style>
