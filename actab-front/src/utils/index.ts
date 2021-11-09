import { NIcon } from "naive-ui";
import { h } from "vue";

export function renderIcon(icon: any) {
  return (): any => h(NIcon, null, { default: () => h(icon) });
}

export function formatDuring(msTime: number) {
  const time = msTime / 1000;
  const day = Math.floor(time / 60 / 60 / 24);
  const hour = Math.floor(time / 60 / 60) % 24;
  const minute = Math.floor(time / 60) % 60;
  const second = Math.floor(time) % 60;
  return { day, hour, minute, second };
}

export function formatDuringToString(msTime: number) {
  const { day, hour, minute, second } = formatDuring(msTime);
  const dayStr = (Array(2).join("0") + day).slice(-2);
  const hourStr = (Array(2).join("0") + hour).slice(-2);
  const minuteStr = (Array(2).join("0") + minute).slice(-2);
  const secondStr = (Array(2).join("0") + second).slice(-2);
  return `${dayStr === "00" ? "" : dayStr + ":"}${
    hourStr === "00" ? "" : hourStr + ":"
  }${minuteStr}:${secondStr}`;
}

export { Apis } from "./requests";
