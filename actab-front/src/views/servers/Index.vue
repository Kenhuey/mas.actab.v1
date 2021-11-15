<template>
  <div class="container">
    <div class="container-card">
      <router-header :list="[...routeTitle]" />
      <n-card>
        <div class="card-title-container-s title-padding-bottom">
          <div class="main-title-s">
            Servers
          </div>
          <div class="container-online-statu" v-if="!liverServerListLoading">
            <span class="online-server-text-span"
              >{{ liveServerList.length }} Server(s) Online</span
            >
            <n-badge
              v-if="liveServerList.length > 0 && !liverServerListLoading"
              type="success"
              dot
            />
            <n-badge
              v-if="liveServerList.length === 0 && !liverServerListLoading"
              type="error"
              dot
            />
          </div>
        </div>
        <div v-if="!liverServerListLoading && liveServerList.length > 0">
          <div>
            <n-select
              :options="onlineServerOptions"
              class="title-padding-bottom"
              v-model:value="selectedServerIndex"
            />
          </div>
        </div>
        <div v-if="!liverServerListLoading && liveServerList.length === 0">
          Non servers running :(
        </div>
        <div
          v-show="selectedServerIndex !== undefined"
          class="live-map-container"
        >
          <n-scrollbar x-scrollable class="live-map-scroll-container">
            <div id="containerMap" @wheel="onMapWheel" @wheel.prevent></div>
          </n-scrollbar>
          <div class="player-list-container">
            <n-data-table
              :columns="onlinePlayerColums"
              :data="onlinePlayerDatas"
            />
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onMounted, nextTick, watch, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Apis } from "@/utils";
import { NBadge, NButton } from "naive-ui";
import Konva from "konva";
import RouterHeader from "@/components/RouterHeader/RouterHeader.vue";

const playerColors = [
  "#00993e",
  "#0192c9",
  "#22297a",
  "#c7177a",
  "#d8252b",
  "#fcdb00",
  "#009380",
  "#0092cb",
  "#05f9ff",
  "#ff9af8",
  "#fffe39",
  "#35fa0d",
  "#fb9000",
  "#6e3cbd",
  "#946128",
  "#006b05"
];

export default defineComponent({
  name: "Servers",
  components: { RouterHeader },
  setup() {
    // Common Resource
    const route = useRoute();
    const router = useRouter();
    const routeTitle: Ref<Array<string>> = ref([]);
    if (typeof route.meta.title === "string") {
      routeTitle.value.push(route.meta.title);
      routeTitle.value.push("All");
    }
    const onlineServerOptions: Ref<any[]> = ref([]);
    const selectedServerIndex = ref();
    const liveServerList: Ref<any[]> = ref([]);
    const liverServerListLoading = ref(true);
    const onlinePlayerDatas: Ref<any[]> = ref([]);
    // Get datas
    Apis.common.requestLiveServer().then(res => {
      const data = res.data.liveServers;
      liveServerList.value = data;
      onlinePlayerDatas.value = [];
      for (let i = 0; i < data.length; i += 1) {
        onlineServerOptions.value.push({
          label: data[i].server.serverName,
          value: i
        });
        if (i === 0) {
          selectedServerIndex.value = 0;
        }
      }
      liverServerListLoading.value = false;
    });
    // Map resources
    const stageRef: Ref<Konva.Stage | undefined> = ref();
    const carLayerRef: Ref<Konva.Layer | undefined> = ref();
    const mapLayerRef: Ref<Konva.Layer | undefined> = ref();
    const lastMapWs: Ref<WebSocket | undefined> = ref();
    // Draw map
    onMounted(() => {
      nextTick(() => {
        const stage = new Konva.Stage({
          container: "containerMap", // id of container <div>
          width: 512,
          height: 512,
          draggable: true
        });
        stageRef.value?.setAttrs({
          scaleX: 0.4,
          scaleY: 0.4
        });
        stageRef.value = stage;
      });
    });
    function onMapWheel(event: any) {
      if (stageRef.value !== undefined) {
        if (
          event.wheelDelta > 0 &&
          stageRef.value.scaleX() < 0.9 &&
          stageRef.value.scaleY() < 0.9
        ) {
          stageRef.value?.setAttrs({
            scaleX: stageRef.value.scaleX() + 0.1,
            scaleY: stageRef.value.scaleY() + 0.1
          });
        } else if (
          event.wheelDelta < 0 &&
          stageRef.value.scaleX() > 0.5 &&
          stageRef.value.scaleY() > 0.5
        ) {
          stageRef.value?.setAttrs({
            scaleX: stageRef.value.scaleX() - 0.1,
            scaleY: stageRef.value.scaleY() - 0.1
          });
        }
      }
    }
    watch(selectedServerIndex, newValue => {
      if (lastMapWs.value !== undefined) {
        try {
          lastMapWs.value.close();
        } catch (error) {
          console.error(error);
        }
      }
      carLayerRef.value = new Konva.Layer();
      lastMapWs.value = Apis.common.wsRequestLiveMap(
        liveServerList.value[newValue].server.tempUUID
      );
      // Draw map
      const mapImageObj = new Image();
      mapImageObj.onload = () => {
        const map = new Konva.Image({
          x: -parseFloat(liveServerList.value[newValue].mapMeta.widthOffset),
          y: -parseFloat(liveServerList.value[newValue].mapMeta.heightOffset),
          width: parseFloat(liveServerList.value[newValue].mapMeta.width),
          height: parseFloat(liveServerList.value[newValue].mapMeta.height),
          image: mapImageObj
        });
        if (mapLayerRef.value !== undefined) {
          mapLayerRef.value.remove();
        }
        mapLayerRef.value = new Konva.Layer();
        mapLayerRef.value.add(map);
        mapLayerRef.value.batchDraw();
        stageRef.value?.add(mapLayerRef.value);
      };
      // Set middle position
      stageRef.value?.setAttrs({
        position: {
          x: parseFloat(liveServerList.value[newValue].mapMeta.widthOffset),
          y: parseFloat(liveServerList.value[newValue].mapMeta.heightOffset)
        }
      });
      mapImageObj.src = `data:image/png;base64,${liveServerList.value[newValue].mapB64}`;
      lastMapWs.value.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        // Delete old layer
        if (carLayerRef.value !== undefined) {
          try {
            carLayerRef.value.remove();
          } catch (error) {
            console.error(error);
          }
        }
        if (data.length !== 0) {
          // New layer
          carLayerRef.value = new Konva.Layer();
          onlinePlayerDatas.value = [];
          for (let i = 0; i < data.length; i += 1) {
            const circle = new Konva.Circle({
              x: data[i].positionX,
              y: data[i].positionZ,
              radius: 4,
              fill: playerColors[i]
            });
            carLayerRef.value.add(circle);
            // Update player
            onlinePlayerDatas.value.push({
              carId: data[i].carId,
              x: data[i].positionX,
              y: data[i].positionY,
              z: data[i].positionZ,
              playerNick: data[i].playerNick,
              playerGuid: data[i].playerGuid
            });
          }
          stageRef.value?.add(carLayerRef.value);
        }
      };
    });
    // Update player list
    const onlinePlayerColums = [
      {
        title: "Color",
        align: "center",
        render(_row: any, index: any) {
          return h(NBadge, { dot: true, color: playerColors[index] }, {});
        }
      },
      {
        title: "Car Index",
        key: "carId"
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
                  params: { uuid: row.playerGuid }
                });
              }
            },
            {
              default: () => {
                return `${row.playerNick}`;
              }
            }
          );
        }
      },
      {
        title: "Position",
        render(row: any) {
          return h(
            "span",
            {},
            {
              default: () => {
                return `X:${row.x}, Y:${row.y}, Z:${row.z}`;
              }
            }
          );
        }
      }
    ];
    // Done
    return {
      routeTitle,
      onlineServerOptions,
      selectedServerIndex,
      liveServerList,
      liverServerListLoading,
      onMapWheel,
      onlinePlayerColums,
      onlinePlayerDatas
    };
  }
});
</script>

<style src="@/styles/common.scss" lang="scss" scope></style>

<style src="./index.scope.scss" lang="scss" scope></style>
