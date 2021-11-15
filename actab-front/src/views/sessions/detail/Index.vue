<template>
  <div class="container">
    <div class="container-card">
      <router-header :list="[...routeTitle]" />
      <div class="container-se-r">
        <div class="card-r">
          <n-card class="banner-card">
            <div class="container-session-detail-main">
              <div class="container-session-detail-main-left">
                <div class="session-banner-container">
                  <div class="session-banner" :style="bannerStyle"></div>
                  <div class="session-title">
                    <span
                      >{{ sessionData.sessionInfo.TrackName }} -
                      {{
                        sessionData.sessionInfo.TrackConfig === ""
                          ? "Default"
                          : sessionData.sessionInfo.TrackConfig
                      }}</span
                    >
                  </div>
                </div>
                <div class="session-info">
                  {{ profileUuid }}
                </div>
                <n-divider class="divider-r" />
                <div class="session-info-total">
                  <div>
                    <span>Type</span>
                    <div>{{ sessionData.sessionInfo.Type }}</div>
                  </div>
                  <div>
                    <span>Players</span>
                    <div>{{ uniquePlayers }}</div>
                  </div>
                  <div>
                    <span>Race Laps</span>
                    <div>
                      {{
                        sessionData.sessionInfo.RaceLaps === 0
                          ? "Inf."
                          : sessionData.sessionInfo.RaceLaps
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="container-session-detail-main-right">
            <div class="session-info-div">
              <div class="session-info-div-inner">
                <div class="session-info-div-inner-title">Date</div>
                <div class="session-info-div-inner-content">
                  {{ new Date(sessionData.sessionInfo.Date) }}
                </div>
              </div>
            </div>
            <div class="main-title-r container-padding-top">
              Summary
            </div>
            <n-data-table class="result-tab" :columns="columns" :data="data" />
          </div> -->
            </div>
          </n-card>
          <n-card
            class="session-detail-tag-container result-card-padding-right"
          >
            <n-table
              :bordered="false"
              :bottom-bordered="false"
              class="session-detail-table"
            >
              <tr>
                <td class="session-detail-text-title">Server Name</td>
                <td class="session-detail-text-content">
                  {{ sessionData.sessionInfo.ServerName }}
                </td>
              </tr>
              <tr>
                <td class="session-detail-text-title">Date</td>
                <td class="session-detail-text-content">
                  {{
                    (() => {
                      const date = new Date(sessionData.sessionInfo.Date);
                      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                    })()
                  }}
                </td>
              </tr>
              <tr>
                <td class="session-detail-text-title">Duration</td>
                <td class="session-detail-text-content">
                  {{ sessionData.sessionInfo.DurationSecs }} Sec.
                </td>
              </tr>
              <tr>
                <td class="session-detail-text-title">Race Laps</td>
                <td class="session-detail-text-content">
                  Lmt. {{ sessionData.sessionInfo.RaceLaps }}
                </td>
              </tr>
            </n-table>
          </n-card>
          <n-card class="result-card-padding-right">
            <div class="session-detail-tag-container">
              <div class="half-flex">
                <div class="item">
                  <n-tag
                    size="tiny"
                    :color="{
                      color: '#f95959',
                      textColor: '#ffffff'
                    }"
                    >{{ sessionData.sessionInfo.FUEL_RATE }}%</n-tag
                  ><span class="item-text">Fuel Rate</span>
                </div>
                <div class="item">
                  <n-tag
                    size="tiny"
                    :color="{
                      color: '#28c76f',
                      textColor: '#ffffff'
                    }"
                    >{{ sessionData.sessionInfo.TYRE_WEAR_RATE }}%</n-tag
                  >
                  <span class="item-text">Tyre Wear Rate</span>
                </div>
              </div>
              <div class="half-flex">
                <div class="item">
                  <n-tag
                    size="tiny"
                    :color="{
                      color: '#00cfe8',
                      textColor: '#ffffff'
                    }"
                    >{{
                      sessionData.sessionInfo.ABS_ALLOWED === 0
                        ? "OFF"
                        : sessionData.sessionInfo.ABS_ALLOWED === 1
                        ? "ON"
                        : sessionData.sessionInfo.ABS_ALLOWED === 2
                        ? "FTY"
                        : "-"
                    }}</n-tag
                  ><span class="item-text">ABS</span>
                </div>
                <div class="item">
                  <n-tag
                    size="tiny"
                    :color="{
                      color: '#ff9f43',
                      textColor: '#ffffff'
                    }"
                    >{{
                      sessionData.sessionInfo.TC_ALLOWED === 0
                        ? "OFF"
                        : sessionData.sessionInfo.TC_ALLOWED === 1
                        ? "ON"
                        : sessionData.sessionInfo.TC_ALLOWED === 2
                        ? "FTY"
                        : "-"
                    }}</n-tag
                  ><span class="item-text">TC</span>
                </div>
              </div>
              <div class="half-flex">
                <div class="item">
                  <n-tag
                    size="tiny"
                    :color="{
                      color: '#5e5e5e',
                      textColor: '#ffffff'
                    }"
                    >{{ sessionData.sessionInfo.DAMAGE_MULTIPLIER }}%</n-tag
                  ><span class="item-text">Damage</span>
                </div>
              </div>
            </div>
          </n-card>
        </div>
        <div class="result-card">
          <n-card class="card-r">
            <div class="main-title-r">
              Result
            </div>
            <el-scrollbar always>
              <n-data-table
                class="result-tab"
                :columns="resultColumns"
                :data="sessionData.sessionResults"
                :loading="loading"
              />
            </el-scrollbar>
          </n-card>
          <n-card class="card-r result-card-padding-right">
            <div class="main-title-r">
              Laps
            </div>
            <el-scrollbar always>
              <n-data-table
                class="result-tab"
                :columns="sectorsColums"
                :data="sectorsData"
                :loading="loading"
                :pagination="{
                  pageSize: 15
                }"
            /></el-scrollbar>
          </n-card>
          <n-card class="card-r result-card-padding-right">
            <div class="main-title-r">
              Crashs
            </div>
            <el-scrollbar always>
              <n-data-table
                class="result-tab"
                :columns="crashsColums"
                :data="sessionData.sessionEvents"
                :loading="loading"
                :pagination="{
                  pageSize: 15
                }"
            /></el-scrollbar>
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, h } from "vue";
import { NButton } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import RouterHeader from "@/components/RouterHeader/RouterHeader.vue";
import { Apis, formatDuringToString } from "@/utils";

export default defineComponent({
  name: "SessionsDetail",
  components: { RouterHeader },
  setup() {
    // Common Resource
    const bannerStyle: Ref<any> = ref({});
    const route = useRoute();
    const router = useRouter();
    const routeTitle: Ref<Array<string>> = ref([]);
    const profileUuid = route.params.uuid.toString();
    if (typeof route.meta.title === "string") {
      routeTitle.value.push("Sessions");
      routeTitle.value.push(route.meta.title);
    }
    const sessionData: Ref<any> = ref({
      sessionInfo: { RaceLaps: -1, Type: "-", ServerName: "-" },
      sessionCars: [],
      sessionEvents: [],
      sessionLaps: [],
      sessionResults: []
    });
    const uniquePlayers = ref(-1);
    const sectorsColums: Ref<Array<any>> = ref([
      {
        title: "Player",
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
                  params: { uuid: row.DriverGuid }
                });
              }
            },
            { default: () => row.playerName }
          );
        }
      }
    ]);
    const sectorsData: Ref<Array<any>> = ref([]);
    const resultColumns = [
      {
        title: "Rank",
        render(_row: any, index: any) {
          return h("span", {}, { default: () => index + 1 });
        }
      },
      {
        title: "Player",
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
                  params: { uuid: row.DriverGuid }
                });
              }
            },
            { default: () => row.DriverName }
          );
        }
      },
      { title: "Car ID", key: "CarId" },
      { title: "Car Model", key: "CarModel" },
      {
        title: "Best Lap",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                return formatDuringToString(row.BestLap);
              }
            }
          );
        }
      },
      {
        title: "Laps/Cuts Count",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                let laps = 0;
                let lapsCut = 0;
                for (
                  let i = 0;
                  i < sessionData.value.sessionLaps.length;
                  i += 1
                ) {
                  if (
                    sessionData.value.sessionLaps[i].DriverGuid ===
                    row.DriverGuid
                  ) {
                    if (sessionData.value.sessionLaps[i].Cuts === 0) {
                      laps += 1;
                    } else {
                      lapsCut += sessionData.value.sessionLaps[i].Cuts;
                    }
                  }
                }
                return `${laps}/${lapsCut}`;
              }
            }
          );
        }
      },
      {
        title: "Crashs",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                let crashs = 0;
                for (
                  let i = 0;
                  i < sessionData.value.sessionEvents.length;
                  i += 1
                ) {
                  if (
                    sessionData.value.sessionEvents[i].DriverGuid ===
                    row.DriverGuid
                  ) {
                    crashs += 1;
                  }
                }
                return crashs;
              }
            }
          );
        }
      }
    ];
    const crashsColums = ref([
      {
        title: "Player",
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
                  params: { uuid: row.DriverGuid }
                });
              }
            },
            { default: () => row.DriverName }
          );
        }
      },
      {
        title: "Impact Speed",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                return `${row.ImpactSpeed}km/h`;
              }
            }
          );
        }
      },
      { title: "World X", key: "WorldPositionX" },
      { title: "World Y", key: "WorldPositionY" },
      { title: "World Z", key: "WorldPositionZ" },
      {
        title: "Impact With",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                if (row.OtherCarId === -1) {
                  return "Env.";
                }
                return row.OtherDriverName;
              }
            }
          );
        }
      }
    ]);
    const loading = ref(true);
    // Get datas
    Apis.common
      .requestSession(profileUuid)
      .then((data: any) => {
        sessionData.value = data.data;
        const playerList = [];
        for (let i = 0; i < sessionData.value.sessionCars.length; i += 1) {
          playerList.push(sessionData.value.sessionCars[i].DriverGuid);
          for (
            let j = 0;
            j < sessionData.value.sessionCars[i].DriverGuidsList.length;
            j += 1
          ) {
            playerList.push(
              sessionData.value.sessionCars[i].DriverGuidsList[j]
            );
          }
        }
        const uniquePlayerList: Array<string> = (() => {
          let temp: Array<string> = [];
          for (let i = 0; i < playerList.length; i += 1) {
            if (temp.indexOf(playerList[i]) === -1) {
              temp.push(playerList[i]);
            }
          }
          return temp;
        })();
        uniquePlayers.value = uniquePlayerList.length;
        // Get sectors
        sectorsColums.value.push({
          title: "Lap Time",
          render(row: any) {
            return h(
              "span",
              {},
              {
                default: () => {
                  return formatDuringToString(row.lapTime);
                }
              }
            );
          }
        });
        sectorsColums.value.push({
          title: "Cuts",
          render(row: any) {
            return h(
              "span",
              {
                style: {
                  color: (() => {
                    if (row.Cuts > 0) {
                      return "#f95959";
                    }
                  })()
                }
              },
              {
                default: () => {
                  return row.Cuts;
                }
              }
            );
          }
        });
        if (sessionData.value.sessionLaps[0] !== undefined) {
          for (
            let i = 0;
            i < sessionData.value.sessionLaps[0].Sectors.length;
            i += 1
          ) {
            sectorsColums.value.push({
              title: `Sector [${i + 1}]`,
              render(row: any) {
                return h(
                  "span",
                  {},
                  {
                    default: () => {
                      return formatDuringToString(row[`Sector${i + 1}`]);
                    }
                  }
                );
              }
            });
          }
        }
        for (let i = 0; i < sessionData.value.sessionLaps.length; i += 1) {
          const sectorData: any = {};
          sectorData.playerName = sessionData.value.sessionLaps[i].DriverName;
          sectorData.DriverGuid = sessionData.value.sessionLaps[i].DriverGuid;
          sectorData.Cuts = sessionData.value.sessionLaps[i].Cuts;
          for (
            let j = 0;
            j < sessionData.value.sessionLaps[i].Sectors.length;
            j++
          ) {
            sectorData[`Sector${j + 1}`] =
              sessionData.value.sessionLaps[i].Sectors[j];
          }
          sectorData.lapTime = sessionData.value.sessionLaps[i].LapTime;
          sectorsData.value.push(sectorData);
        }
        // Set banner
        bannerStyle.value = {
          backgroundImage: `url("data:image/png;base64,${sessionData.value.sessionBannerB64Str}")`
        };
        // Done
        loading.value = false;
      })
      // Get crashs
      .catch(error => {
        console.error(error);
        router.push("/statu/404");
      });
    // Done
    return {
      routeTitle,
      profileUuid,
      sessionData,
      uniquePlayers,
      resultColumns,
      sectorsColums,
      sectorsData,
      crashsColums,
      loading,
      bannerStyle
    };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./index.scope.scss" lang="scss" scope></style>
