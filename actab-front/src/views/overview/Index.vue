<template>
  <div class="container">
    <div class="flex-card">
      <!-- <div class="container-card">
        <el-carousel class="carousel">
          <el-carousel-item
            v-for="item in 4"
            :key="item"
            class="carousel-background"
          >
            <h3 class="small">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div> -->
    </div>
    <div class="flex-card">
      <div class="container-card card-online-server">
        <n-card class="full-height">
          <div class="leave-height">
            <div class="card-title statu-title">Statu</div>
            <div class="leave-height-inner">
              <n-statistic
                label="Live Servers"
                :value="
                  liveServers.liveServers === undefined
                    ? 0
                    : liveServers.liveServers.length
                "
                class="statu-servers-content"
              >
                <template #prefix>
                  <n-icon>
                    <AlignBoxTopCenter />
                  </n-icon>
                </template>
              </n-statistic>
              <n-statistic label="Online Players" class="statu-servers-content">
                {{ onlinePlayers }}
              </n-statistic>
            </div>
            <n-statistic
              label="Activity Server"
              class="statu-servers-content-event"
            >
              <n-ellipsis style="max-width: 100%;">
                <div v-if="liveServers.liveServers[0] !== undefined">
                  <n-button size="tiny" type="info" @click="jumpToServerPage">
                    {{ liveServers.liveServers[0].server.serverName }}
                  </n-button>
                </div>
                <div v-else>
                  -
                </div>
              </n-ellipsis>
            </n-statistic>
          </div>
        </n-card>
      </div>
      <div class="container-card">
        <n-card class="full-height">
          <div class="statistics-container">
            <div class="card-title-container-s">
              <div class="card-title">Statistics</div>
            </div>
            <div class="card-content statistics-content">
              <div class="statistics-item">
                <n-icon class="statistics-icon" style="background: #fff3e8;">
                  <user class="statistics-icon-inner" style="color: #ff9f43;" />
                </n-icon>
                <div class="statistics-text">
                  <span class="statistics-text-count">{{
                    overviewDatas.statistics.totalPlayers
                  }}</span>
                  <br />
                  <span class="statistics-text-type">Total Players</span>
                </div>
              </div>
              <div class="statistics-item">
                <n-icon class="statistics-icon" style="background: #f1e3e3;">
                  <circle-dash
                    class="statistics-icon-inner"
                    style="color: #9e6a6a;"
                  />
                </n-icon>
                <div class="statistics-text">
                  <span class="statistics-text-count">{{
                    overviewDatas.statistics.totalLaps
                  }}</span>
                  <br />
                  <span class="statistics-text-type">Total Laps</span>
                </div>
              </div>
              <div class="statistics-item">
                <n-icon class="statistics-icon" style="background: #d7f9fd;">
                  <ai-results
                    class="statistics-icon-inner"
                    style="color: #00cfe8;"
                  />
                </n-icon>
                <div class="statistics-text">
                  <span class="statistics-text-count">{{
                    overviewDatas.statistics.totalSessions
                  }}</span>
                  <br />
                  <span class="statistics-text-type">Total Sessions</span>
                </div>
              </div>
              <div class="statistics-item">
                <n-icon class="statistics-icon" style="background: #fceaea;">
                  <road class="statistics-icon-inner" style="color: #ec7878;" />
                </n-icon>
                <div class="statistics-text">
                  <span class="statistics-text-count">-</span>
                  <br />
                  <span class="statistics-text-type">Total Tracks</span>
                </div>
              </div>
              <div class="statistics-item">
                <n-icon class="statistics-icon" style="background: #e0e0e6;">
                  <car class="statistics-icon-inner" style="color: #7d818b;" />
                </n-icon>
                <div class="statistics-text">
                  <span class="statistics-text-count">-</span>
                  <br />
                  <span class="statistics-text-type">Total Cars</span>
                </div>
              </div>
              <div class="statistics-item">
                <n-icon class="statistics-icon" style="background: #e5f8ed;">
                  <flag class="statistics-icon-inner" style="color: #28c76f;" />
                </n-icon>
                <div class="statistics-text">
                  <span class="statistics-text-count">-</span>
                  <br />
                  <span class="statistics-text-type">Races</span>
                </div>
              </div>
              <div class="statistics-item"></div>
              <div class="statistics-item"></div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
    <div class="flex-card">
      <div class="ranking-board container-card">
        <n-card class="full-height tab-card">
          <n-tabs class="tab-card-tab" size="small">
            <n-tab-pane name="recentSession" tab="Recent Sessions">
              <n-data-table
                class="recent-session-tab"
                :bordered="false"
                :columns="recentSessionColumns"
                :data="overviewDatas.recentSessions"
                size="small"
                :loading="loading"
              />
              <n-data-table
                class="recent-session-tab-mobile"
                :bordered="false"
                :columns="recentSessionColumnsMobile"
                :data="overviewDatas.recentSessions"
                size="small"
                :loading="loading"
              />
            </n-tab-pane>
            <n-tab-pane name="recentRaces" tab="Recent Races">
              Comming Soon
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </div>
      <div class="container-card info-board">
        <n-card class="message-board">
          <div class="card-title">Join Us!</div>
          <div class="card-content">
            More than Assetto Corsa.
          </div>
          <template #footer>
            <div class="join-us-buttons">
              <n-button color="#41b883" size="small">
                <template #icon>
                  <n-icon>
                    <qq-outlined />
                  </n-icon>
                </template>
                DEV
              </n-button>
              <!-- <n-button
                color="#41b883"
                size="small"
                class="card-text-margin-right"
              >
                <template #icon>
                  <n-icon>
                    <qq-outlined />
                  </n-icon>
                </template>
                LRAC
              </n-button> -->
            </div>
          </template>
        </n-card>
        <n-card class="laps-board"
          ><div class="card-title">Most Laps</div>
          <!-- <div class="card-content sub-title">
            Last Update: 1145.1.4 19:19:8.10
          </div> -->
          <n-data-table
            class="most-laps-ranks-tab"
            :bordered="false"
            :columns="mostLapsColumns"
            :data="overviewDatas.mostLaps"
            size="small"
            :loading="loading"
        /></n-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { QqOutlined } from "@vicons/antd";
import {
  User,
  Flag,
  Car,
  AiResults,
  Road,
  CircleDash,
  AlignBoxTopCenter
} from "@vicons/carbon";
import { defineComponent, h, ref, Ref } from "vue";
import { NButton } from "naive-ui";
import { useRouter } from "vue-router";
import { Apis } from "@/utils";

export default defineComponent({
  name: "Overview",
  components: {
    QqOutlined,
    User,
    Flag,
    Car,
    AiResults,
    Road,
    CircleDash,
    AlignBoxTopCenter
  },
  setup() {
    // Common resources
    const router = useRouter();
    const overviewDatas: Ref<any> = ref({
      statistics: { totalPlayers: "-", totalLaps: "-", totalSessions: "-" },
      recentSessions: [],
      mostLaps: []
    });
    const recentSessionColumns = [
      {
        title: "Server",
        key: "ServerName"
      },
      {
        title: "Track",
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
            { default: () => row.TrackName }
          );
        }
      },
      {
        title: "1st",
        render(row: any) {
          return h(
            NButton,
            {
              // color: "#18a085",
              // text: true,
              size: "tiny",
              onClick: () => {
                router.push({
                  name: "playerProfile",
                  params: { uuid: row.rank[0].sessionResult_DriverGuid }
                });
              }
            },
            { default: () => row.rank[0].sessionResult_DriverName }
          );
        }
      },
      {
        title: "2nd",
        render(row: any) {
          if (row.rank[1] !== undefined) {
            return h(
              NButton,
              {
                // color: "#18a085",
                // text: true,
                size: "tiny",
                onClick: () => {
                  router.push({
                    name: "playerProfile",
                    params: { uuid: row.rank[1].sessionResult_DriverGuid }
                  });
                }
              },
              { default: () => row.rank[1].sessionResult_DriverName }
            );
          } else {
            return h(
              "span",
              {},
              {
                default: () => {
                  return "/";
                }
              }
            );
          }
        }
      },
      {
        title: "3rd",
        render(row: any) {
          if (row.rank[2] !== undefined) {
            return h(
              NButton,
              {
                // color: "#18a085",
                // text: true,
                size: "tiny",
                onClick: () => {
                  router.push({
                    name: "playerProfile",
                    params: { uuid: row.rank[2].sessionResult_DriverGuid }
                  });
                }
              },
              { default: () => row.rank[2].sessionResult_DriverName }
            );
          } else {
            return h(
              "span",
              {},
              {
                default: () => {
                  return "/";
                }
              }
            );
          }
        }
      },
      {
        title: "Time",
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
      }
    ];
    const recentSessionColumnsMobile = [
      {
        title: "Track",
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
            { default: () => row.TrackName }
          );
        }
      },
      {
        title: "Time",
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
      }
    ];
    const mostLapsColumns = [
      {
        title: "Rank",
        render(_row: any, index: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                return index + 1;
              }
            }
          );
        }
      },
      {
        title: "Player",
        render(row: any) {
          return h(
            NButton,
            {
              size: "tiny",
              onClick: () => {
                router.push({
                  name: "playerProfile",
                  params: { uuid: row.sessionLap_DriverGuid }
                });
              }
            },
            { default: () => row.sessionLap_DriverName }
          );
        }
      },
      {
        title: "Laps",
        key: "count"
      }
    ];
    const loading = ref(true);
    const liveServers: any = ref({ liveServers: [] });
    const onlinePlayers = ref(0);
    // Get datas
    Apis.common.requestOverview().then(res => {
      const data = res.data;
      overviewDatas.value = data;
      loading.value = false;
    });
    Apis.common.requestLiveServer().then(res => {
      liveServers.value = res.data;
      let playerCount = 0;
      for (let i = 0; i < liveServers.value.liveServers.length; i += 1) {
        playerCount += liveServers.value.liveServers[i].player.length;
      }
      onlinePlayers.value = playerCount;
    });
    function jumpToServerPage() {
      router.push({ name: "servers" });
    }
    // Done
    return {
      mostLapsColumns,
      recentSessionColumns,
      recentSessionColumnsMobile,
      overviewDatas,
      loading,
      liveServers,
      onlinePlayers,
      jumpToServerPage
    };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./index.scope.scss" lang="scss" scope></style>
