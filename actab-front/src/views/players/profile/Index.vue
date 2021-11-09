<template>
  <div class="container">
    <router-header :list="[...routeTitle]" class="router-header-container" />
    <div class="flex-card flex-card-profile">
      <div class="container-card container-card-profile">
        <n-card class="card-main-info">
          <div class="container-main-info">
            <div class="container-info-avatar">
              <div class="container-info-avatar-inner">
                <div class="container-info-avatar-pic-outer">
                  <div class="container-info-avatar-pic">1</div>
                </div>
                <div class="container-info-avatar-detail-1">
                  <div class="user-nick-text">
                    {{
                      playerDetail.playerInfo.RecentNick === undefined
                        ? "-"
                        : playerDetail.playerInfo.RecentNick
                    }}
                  </div>
                  <div class="user-info-statu">
                    <div class="user-info-text">
                      <n-badge dot /><span class="user-info-text-span">-</span>
                    </div>
                    <div class="user-info-text steam-guid-text">
                      Steam:<span class="user-info-text-span">
                        {{
                          playerDetail.playerInfo.SteamGUID === undefined
                            ? "-"
                            : playerDetail.playerInfo.SteamGUID
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="container-info-detail-total">
                <div class="container-info-detail-total-div">
                  <div class="flex-item-total">
                    <div class="flex-item-icon"></div>
                    <div class="flex-item-data">
                      <div>
                        {{
                          playerDetail.playerSessions === undefined
                            ? "-"
                            : playerDetail.playerSessions.length
                        }}
                      </div>
                      <div class="flex-item-name">Sessions</div>
                    </div>
                  </div>
                </div>
                <!-- <div class="container-info-detail-total-div">
                  <div class="container-info-detail-total-div">
                    <div class="flex-item-total">
                      <div class="flex-item-icon"></div>
                      <div class="flex-item-data">
                        <div>0</div>
                        <div class="flex-item-name">Races</div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <div class="container-info-detail-total-div">
                  <div class="container-info-detail-total-div">
                    <div class="flex-item-total">
                      <div class="flex-item-icon"></div>
                      <div class="flex-item-data">
                        <div>
                          {{
                            playerDetail.playerLaps === undefined
                              ? "-"
                              : playerDetail.playerLaps
                          }}
                        </div>
                        <div class="flex-item-name">Laps</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="container-info-detail">
              <div class="container-info-span">
                <div class="container-info-span-inner">Join</div>
                <div class="container-info-span-inner">
                  {{
                    playerDetail.playerInfo.JoinDate !== undefined
                      ? new Date(
                          playerDetail.playerInfo.JoinDate
                        ).toLocaleDateString()
                      : "-"
                  }}
                  &nbsp;
                  {{
                    playerDetail.playerInfo.JoinDate !== undefined
                      ? new Date(
                          playerDetail.playerInfo.JoinDate
                        ).toLocaleTimeString()
                      : "-"
                  }}
                </div>
              </div>
              <div class="container-info-span">
                <div class="container-info-span-inner">Recent Online</div>
                <div class="container-info-span-inner">
                  {{
                    playerDetail.playerInfo.RecentOnline !== undefined
                      ? new Date(
                          playerDetail.playerInfo.RecentOnline
                        ).toLocaleDateString()
                      : "-"
                  }}
                  &nbsp;
                  {{
                    playerDetail.playerInfo.RecentOnline !== undefined
                      ? new Date(
                          playerDetail.playerInfo.RecentOnline
                        ).toLocaleTimeString()
                      : "-"
                  }}
                </div>
              </div>
              <div class="container-info-span">
                <div class="container-info-span-inner">Recent Session</div>
                <div class="container-info-span-inner">
                  <n-button
                    size="tiny"
                    class="button-to-session"
                    @click="
                      jumpToSession(
                        playerDetail.playerDetail.recentSession.sessionUuid
                      )
                    "
                  >
                    {{ playerDetail.playerDetail.recentSession.sessionTrack }}
                  </n-button>
                </div>
              </div>
              <div class="container-info-span">
                <div class="container-info-span-inner">Team</div>
                <div class="container-info-span-inner">-</div>
              </div>
              <div class="container-info-span">
                <div class="container-info-span-inner">Ban Statu</div>
                <div class="container-info-span-inner">-</div>
              </div>
              <div class="container-info-span">
                <div class="container-info-span-inner">
                  Assetto Corsa Play Time
                </div>
                <div class="container-info-span-inner">-</div>
              </div>
            </div>
          </div>
        </n-card>
      </div>
      <div class="container-card container-card-profile info-more-container">
        <n-card class="card-more-info">
          <div class="container-statu-info">
            <!-- <div style="width: 100%;">
              <div class="user-statu-title user-statu-title-user">User</div>
              <div class="user-statu-container">
                <div class="user-statu-inner">
                  <div class="user-statu-inner-bg">
                    <div>Registered</div>
                    <div class="user-statu-inner-data">
                      -
                    </div>
                  </div>
                </div>
                <div class="user-statu-inner">
                  <div class="user-statu-inner-bg">
                    <div>Group</div>
                    <div class="user-statu-inner-data">Admin</div>
                  </div>
                </div>
                <div class="user-statu-inner">
                  <div class="user-statu-inner-bg">
                    <div>Statu</div>
                    <div class="user-statu-inner-data">Banned</div>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="container-statu-playing">
              <div class="container-statu-playing-title">
                <div class="user-statu-title">Playing</div>
              </div>
              <div class="container-statu-playing-data">
                <div class="user-statu-playing">
                  -
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
    <div class="container-card container-card-profile">
      <n-card class="card-more-info">
        <div class="card-title-container-p">
          <div class="main-title">
            Sessions
          </div>
          <!-- <div class="main-search">
            <n-input-group>
              <n-input size="small" />
              <n-button type="primary" size="small">Search</n-button>
            </n-input-group>
          </div> -->
        </div>
        <el-scrollbar always>
          <div class="data-tab player-tab-scroll">
            <n-data-table
              :columns="sessionColumns"
              :data="playerDetail.playerSessions"
              :pagination="sessionPagination"
              :loading="loading"
            /></div
        ></el-scrollbar>
      </n-card>
    </div>
    <!-- <div class="container-card container-card-profile">
      <n-card class="card-more-info">
        <div class="card-title">Races</div>
        <div class="data-tab">
          <n-data-table
            :columns="columns"
            :data="data"
            :pagination="pagination"
          />
        </div>
      </n-card>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, h, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import RouterHeader from "@/components/RouterHeader/RouterHeader.vue";
import { Apis, formatDuringToString } from "@/utils";
import { NButton } from "naive-ui";

export default defineComponent({
  name: "PlayerProfile",
  components: { RouterHeader },
  setup() {
    // Common Resource
    const loading = ref(true);
    const route = useRoute();
    const router = useRouter();
    const routeTitle: Ref<Array<string>> = ref([]);
    const profileUuid = route.params.uuid.toString();
    if (typeof route.meta.title === "string") {
      routeTitle.value.push("Players");
      routeTitle.value.push(route.meta.title);
    }
    const playerDetail: Ref<any> = ref({
      playerInfo: {},
      playerDetail: { recentSession: { sessionTrack: "-" } }
    });
    function jumpToSession(sessionUuid: string) {
      router.push({
        name: "sessionsDetail",
        params: { uuid: sessionUuid }
      });
    }
    const sessionColumns = [
      {
        title: "Date",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                const date = new Date(row.playerSession.Date);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
              }
            }
          );
        }
      },
      {
        title: "Session UUID",
        render(row: any) {
          return h(
            NButton,
            {
              size: "tiny",
              onClick: () => {
                router.push({
                  name: "sessionsDetail",
                  params: { uuid: row.playerSession.UUID }
                });
              }
            },
            {
              default: () => {
                return row.playerSession.UUID;
              }
            }
          );
        }
      },
      {
        title: "Server",
        key: "playerSession.ServerName"
      },
      {
        title: "Track",
        key: "playerSession.TrackName"
      },
      {
        title: "Last Drive Car",
        key: "playerResult.CarModel"
      },
      {
        title: "Fastest Lap",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                return formatDuringToString(row.playerResult.BestLap);
              }
            }
          );
        }
      }
    ];
    // Get datas
    Apis.common
      .requestPlayerDetail(profileUuid)
      .then(res => {
        playerDetail.value = res.data;
        loading.value = false;
      })
      .catch(error => {
        console.error(error);
        router.push("/statu/404");
      });
    const sessionPagination = reactive({
      pageSize: 15
    });
    // Done
    return {
      routeTitle,
      sessionColumns,
      playerDetail,
      jumpToSession,
      loading,
      sessionPagination
    };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./index.scope.scss" lang="scss" scope></style>
