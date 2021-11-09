import { service } from "..";

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
