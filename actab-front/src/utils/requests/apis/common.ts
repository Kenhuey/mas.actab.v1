import { service, apiHost } from "..";

export function requestAllSessions() {
  return service.request({
    method: "GET",
    url: "/sessions",
  });
}

export function requestSession(sessionUuid: string) {
  return service.request({
    method: "GET",
    url: `/sessions/detail?sessionUuid=${sessionUuid}`,
  });
}

export function requestPlayerDetail(playerGUID: string) {
  return service.request({
    method: "GET",
    url: `/player/detail?playerGuid=${playerGUID}`,
  });
}

export function requestAllPlayer() {
  return service.request({
    method: "GET",
    url: `/players`,
  });
}

export function requestOverview() {
  return service.request({
    method: "GET",
    url: `/overview`,
  });
}

export function requestLiveServer() {
  return service.request({
    method: "GET",
    url: `/servers/live`,
  });
}

export function requestPlayerStatu(guid: string) {
  return service.request({
    method: "GET",
    url: `/player/statu?guid=${guid}`,
  });
}

export function wsRequestLiveMap(serverUuid: string) {
  const socket = new WebSocket(
    `ws://${apiHost}/live/map?serverUuid=${serverUuid}`
  );
  return socket;
}
