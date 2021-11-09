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
                :value="-1"
                class="statu-servers-content"
              >
                <template #prefix>
                  <n-icon>
                    <AlignBoxTopCenter />
                  </n-icon>
                </template>
              </n-statistic>
              <n-statistic label="Online Players" class="statu-servers-content"
                >-1</n-statistic
              >
            </div>
            <n-statistic
              label="Activity Server"
              class="statu-servers-content-event"
            >
              <n-ellipsis style="max-width: 100%;">-</n-ellipsis></n-statistic
            >
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
                  <span class="statistics-text-count">114</span>
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
                  <span class="statistics-text-count">514</span>
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
                  <span class="statistics-text-count">1919</span>
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
                :data="tempRecentSessionData"
                size="small"
              />
              <n-data-table
                class="recent-session-tab-mobile"
                :bordered="false"
                :columns="recentSessionColumnsMobile"
                :data="tempRecentSessionData"
                size="small"
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
            :data="tempMostLapsData"
            size="small"
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
import { defineComponent, h } from "vue";
import { DataTableColumn, NTag } from "naive-ui";

const mostLapsColumns: Array<DataTableColumn> = [
  {
    key: "rank",
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: "player",
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: "laps",
    ellipsis: {
      tooltip: true
    }
  }
];

const tempMostLapsData = [
  {
    rank: 1,
    player: "HgBiss",
    laps: "67"
  },
  {
    rank: 2,
    player: "Piggy",
    laps: "9"
  },
  {
    rank: 3,
    player: "pk",
    laps: "7"
  }
];

const recentSessionColumns: Array<DataTableColumn> = [
  {
    title: "Server",
    key: "server",
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "Track",
    key: "track",
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "1st",
    key: "champion",
    ellipsis: {
      tooltip: true
    },
    render(row: any) {
      const tag = h(
        NTag,
        {
          style: {
            cursor: "pointer"
          },
          size: "small"
        },
        {
          default: () => row.champion
        }
      );
      return tag;
    }
  },
  {
    title: "2nd",
    key: "runup",
    ellipsis: {
      tooltip: true
    },
    render(row: any) {
      const tag = h(
        NTag,
        {
          style: {
            cursor: "pointer"
          },
          size: "small"
        },
        {
          default: () => row.runup
        }
      );
      return tag;
    }
  },
  {
    title: "3rd",
    key: "third",
    ellipsis: {
      tooltip: true
    },
    render(row: any) {
      const tag = h(
        NTag,
        {
          style: {
            cursor: "pointer"
          },
          size: "small"
        },
        {
          default: () => row.third
        }
      );
      return tag;
    }
  },
  {
    title: "Time",
    key: "time",
    ellipsis: {
      tooltip: true
    }
  }
];

const recentSessionColumnsMobile = [
  {
    title: "Track",
    key: "track",
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "Time",
    key: "time",
    ellipsis: {
      tooltip: true
    }
  }
];

const tempRecentSessionData = [
  {
    key: 0,
    server: "LRAC Test Server",
    track: "Northern New York",
    champion: "NgHunter",
    runup: "CantonPD",
    third: "CNCCP",
    time: "2021-11-4 5:14"
  },
  {
    key: 1,
    server: "LRAC Test Server",
    track: "Kaw Loong",
    champion: "Shit",
    runup: "Junk",
    third: "Monkey",
    time: "2021-11-4 5:14"
  }
];

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
    // Done
    return {
      mostLapsColumns,
      tempMostLapsData,
      recentSessionColumns,
      recentSessionColumnsMobile,
      tempRecentSessionData
    };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./index.scope.scss" lang="scss" scope></style>
