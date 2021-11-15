import { ParameterizedContext, Next } from "koa";
import { IRouterParamContext } from "koa-router";
import { getManager, Not } from "typeorm";
import INI from "ini";
import FileStream from "fs";
import Path from "path";
import { BaseController, setCommonHeader } from "..";
import {
  Session,
  SessionCar,
  SessionEvent,
  SessionLap,
  SessionResult,
  Users,
  CachePlayer,
  CacheServer,
} from "../../../../orm";
import * as HardCode from "../../../../hardcode";
import { Configs } from "../../../../cores";

export class GetSessionController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const { sessionUuid } = context.request.query;
      if (sessionUuid === undefined) {
        context.body = await getManager()
          .getRepository(Session)
          .find({ order: { Date: "DESC" } });
      } else {
        context.body = await getManager()
          .getRepository(Session)
          .findOne({
            where: {
              UUID: sessionUuid,
            },
          });
      }
      next();
    };
  }
}

export class GetSessionDetailController extends BaseController {
  public middleware(configs: Configs) {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const { sessionUuid } = context.request.query;
      if (sessionUuid === undefined) {
        context.status = 404;
        return;
      }
      const session = await getManager()
        .getRepository(Session)
        .findOne({
          where: {
            UUID: sessionUuid,
          },
        });
      if (session === undefined) {
        context.status = 404;
        return;
      }
      const cars = await getManager()
        .getRepository(SessionCar)
        .find({
          relations: ["Session"],
          where: {
            Session: session,
            DriverGuid: Not(""),
          },
        });
      const events = await getManager()
        .getRepository(SessionEvent)
        .find({
          relations: ["Session"],
          where: {
            Session: session,
          },
        });
      const laps = await getManager()
        .getRepository(SessionLap)
        .find({
          relations: ["Session"],
          where: {
            Session: session,
          },
        });
      const results = await getManager()
        .getRepository(SessionResult)
        .find({
          relations: ["Session"],
          where: {
            Session: session,
            DriverGuid: Not(""),
          },
          order: { BestLap: "DESC" },
        });
      // Get map banner
      let mapBannerB64Str: string;
      try {
        const mapFile = FileStream.readFileSync(
          Path.join(
            configs.ac.path,
            `/content/tracks/${session.TrackName}/ui/${session.TrackConfig}/preview.png`
          )
        );
        const mapFileB64BS = Buffer.from(mapFile).toString("base64");
        mapBannerB64Str = mapFileB64BS.toString();
      } catch (_error) {
        mapBannerB64Str = "";
      }
      context.body = {
        sessionInfo: session,
        sessionCars: cars,
        sessionEvents: events,
        sessionLaps: laps,
        sessionResults: results,
        sessionBannerB64Str: mapBannerB64Str,
      };

      next();
    };
  }
}

export class GetSessionCarController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const { sessionUuid } = context.request.query;
      if (sessionUuid === undefined) {
        context.body = [];
      } else {
        const session = await getManager()
          .getRepository(Session)
          .findOne({
            where: {
              UUID: sessionUuid,
            },
          });
        context.body = await getManager()
          .getRepository(SessionCar)
          .find({
            relations: ["Session"],
            where: { Session: session, DriverGuid: Not("") },
          });
      }
      next();
    };
  }
}

export class GetSessionEventController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const { sessionUuid } = context.request.query;
      if (sessionUuid === undefined) {
        context.body = [];
      } else {
        const session = await getManager()
          .getRepository(Session)
          .findOne({
            where: {
              UUID: sessionUuid,
            },
          });
        context.body = await getManager()
          .getRepository(SessionEvent)
          .find({ relations: ["Session"], where: { Session: session } });
      }
      next();
    };
  }
}

export class GetSessionLapController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const { sessionUuid } = context.request.query;
      if (sessionUuid === undefined) {
        context.body = [];
      } else {
        const session = await getManager()
          .getRepository(Session)
          .findOne({
            where: {
              UUID: sessionUuid,
            },
          });
        context.body = await getManager()
          .getRepository(SessionLap)
          .find({ relations: ["Session"], where: { Session: session } });
      }
      next();
    };
  }
}

export class GetSessionResultController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const { sessionUuid } = context.request.query;
      if (sessionUuid === undefined) {
        context.body = [];
      } else {
        const session = await getManager()
          .getRepository(Session)
          .findOne({
            where: {
              UUID: sessionUuid,
            },
          });
        context.body = await getManager()
          .getRepository(SessionResult)
          .find({ relations: ["Session"], where: { Session: session } });
      }
      next();
    };
  }
}

export class GetPlayerDetailController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const { playerGuid } = context.request.query;
      if (playerGuid === undefined) {
        context.status = 404;
        next();
        return;
      }
      const user = await getManager()
        .getRepository(Users)
        .findOne({
          where: {
            SteamGUID: playerGuid,
          },
        });
      if (user === undefined || user === null) {
        context.status = 404;
        next();
        return;
      }
      context.body = {
        playerLaps: await (async () => {
          const laps = await getManager()
            .getRepository(SessionLap)
            .count({ where: { DriverGuid: playerGuid } });
          return laps;
        })(),
        playerInfo: user,
        playerDetail: {
          recentSession: await (async () => {
            const recentLap = await getManager()
              .getRepository(SessionLap)
              .findOne({
                relations: ["Session"],
                where: { DriverGuid: playerGuid },
                order: {
                  lapFinishTempDate: "DESC",
                },
              });
            return {
              sessionTrack: `${recentLap?.Session.TrackName}(${recentLap?.Session.TrackConfig})`,
              sessionUuid: recentLap?.Session.UUID,
            };
          })(),
        },
        playerSessions: await (async () => {
          const uniqueSessionUUID = await getManager()
            .getRepository(SessionLap)
            .createQueryBuilder("sessionLap")
            .select("sessionUuid")
            .orderBy({
              lapFinishTempDate: "DESC",
            })
            .distinct(true)
            .getRawMany();
          const sessions: any[] = [];
          for (let i = 0; i < uniqueSessionUUID.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const sessionInfo = await getManager()
              .getRepository(Session)
              .findOne({
                where: { UUID: uniqueSessionUUID[i].sessionUuid },
                order: { Date: "DESC" },
              });
            if (sessionInfo !== undefined) {
              // eslint-disable-next-line no-await-in-loop
              const result = await getManager()
                .getRepository(SessionResult)
                .findOne({
                  relations: ["Session"],
                  where: {
                    Session: sessionInfo,
                    DriverGuid: playerGuid,
                  },
                });
              if (sessionInfo !== undefined) {
                sessions.push({
                  playerSession: sessionInfo,
                  playerResult: result,
                });
              }
            }
          }
          return sessions;
        })(),
      };
      next();
    };
  }
}

export class GetOverviewController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      context.body = {
        statistics: {
          totalPlayers: await getManager().getRepository(Users).count(),
          totalLaps: await getManager().getRepository(SessionLap).count(),
          totalSessions: await getManager().getRepository(Session).count(),
        },
        recentSessions: await (async () => {
          let sessionsFinal: any = {};
          const sessions = await getManager()
            .getRepository(Session)
            .createQueryBuilder("sessions")
            .limit(10)
            .orderBy({ Date: "DESC" })
            .getMany();
          sessionsFinal = sessions;
          for (let i = 0; i < sessions.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const sessionsResult = await getManager()
              .getRepository(SessionResult)
              .createQueryBuilder("sessionResult")
              .limit(3)
              .orderBy({ BestLap: "ASC" })
              .where({ Session: sessions[i], DriverGuid: Not("") })
              .getRawMany();
            sessionsFinal[i].rank = sessionsResult;
          }
          return sessionsFinal;
        })(),
        mostLaps: await (async () => {
          const laps = await getManager()
            .getRepository(SessionLap)
            .createQueryBuilder("sessionLap")
            .select("COUNT(sessionLap.DriverGuid)", "count")
            .addSelect("sessionLap.DriverName")
            .addSelect("sessionLap.DriverGuid")
            .where({ Cuts: 0 })
            .limit(10)
            .orderBy({ count: "DESC" })
            .getRawMany();
          return laps;
        })(),
      };
      next();
    };
  }
}

export class GetLiveServersController extends BaseController {
  public middleware(configs: Configs) {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const nowDate = new Date();
      const servers = await getManager()
        .getRepository(CacheServer)
        .find({ order: { lastUpdate: "DESC" } });
      const liveServersResult: any = [];
      for (let i = 0; i < servers.length; i += 1) {
        const tempRe: any = {};
        const expire = servers[i].lastUpdate.setSeconds(
          servers[i].lastUpdate.getSeconds() + HardCode.serverGlobalExpireSec
        );
        const now = nowDate.setSeconds(nowDate.getSeconds());
        if (expire > now) {
          // Map file
          try {
            const mapFile = FileStream.readFileSync(
              Path.join(
                configs.ac.path,
                `/content/tracks/${servers[i].lastTrackName}/${servers[i].lastTrackLayout}/map.png`
              )
            );
            const mapFileB64BS = Buffer.from(mapFile).toString("base64");
            tempRe.mapB64 = mapFileB64BS;
          } catch (_error) {
            tempRe.mapB64 = "";
          }
          // Map meta
          try {
            const mapMeta = FileStream.readFileSync(
              Path.join(
                configs.ac.path,
                `/content/tracks/${servers[i].lastTrackName}/${servers[i].lastTrackLayout}/data/map.ini`
              )
            );
            const mapIniMeta = INI.parse(mapMeta.toString());
            if (
              mapIniMeta.PARAMETERS.WIDTH === undefined ||
              mapIniMeta.PARAMETERS.HEIGHT === undefined ||
              mapIniMeta.PARAMETERS.X_OFFSET === undefined ||
              mapIniMeta.PARAMETERS.Z_OFFSET === undefined
            ) {
              throw new Error("Missing meta.");
            }
            tempRe.mapMeta = {
              width: mapIniMeta.PARAMETERS.WIDTH,
              height: mapIniMeta.PARAMETERS.HEIGHT,
              widthOffset: mapIniMeta.PARAMETERS.X_OFFSET,
              heightOffset: mapIniMeta.PARAMETERS.Z_OFFSET,
            };
          } catch (_error) {
            tempRe.mapMeta = {};
          }
          tempRe.server = servers[i];
          // eslint-disable-next-line no-await-in-loop
          tempRe.player = await getManager()
            .getRepository(CachePlayer)
            .find({ where: { lastServerUUID: servers[i].tempUUID } });
          liveServersResult.push(tempRe);
        } else {
          // eslint-disable-next-line no-await-in-loop
          await getManager().getRepository(CacheServer).remove(servers[i]);
        }
      }
      context.body = { liveServers: liveServersResult };
      next();
    };
  }
}

export class GetPlayerStatuController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const { guid } = context.request.query;
      if (guid === undefined) {
        context.body = { online: false };
        return;
      }
      // Get player
      const player = await getManager()
        .getRepository(CachePlayer)
        .findOne({ where: { playerGuid: guid } });
      if (player === undefined) {
        context.body = { online: false };
        return;
      }
      // Get last server
      const lastServer = await getManager()
        .getRepository(CacheServer)
        .findOne({
          where: {
            tempUUID: player.lastServerUUID,
          },
        });
      if (lastServer === undefined) {
        context.body = { online: false };
        return;
      }
      const nowDate = new Date();
      const expire = lastServer.lastUpdate.setSeconds(
        lastServer.lastUpdate.getSeconds() + HardCode.serverGlobalExpireSec
      );
      const now = nowDate.setSeconds(nowDate.getSeconds());
      if (expire > now) {
        context.body = {
          online: true,
          playingServerName: lastServer.serverName,
          playingServerUuid: lastServer.tempUUID,
        };
      } else {
        context.body = { online: false };
        await getManager().getRepository(CachePlayer).remove(player);
      }
      next();
    };
  }
}

export class GetAllPlayersController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      const players: any[] = await getManager()
        .getRepository(Users)
        .find({ order: { JoinDate: "DESC" } });
      for (let i = 0; i < players.length; i += 1) {
        const guid = players[i].SteamGUID;
        // Get player
        // eslint-disable-next-line no-await-in-loop
        const player = await getManager()
          .getRepository(CachePlayer)
          .findOne({ where: { playerGuid: guid } });
        if (player === undefined) {
          players[i].online = false;
          // eslint-disable-next-line no-continue
          continue;
        }
        // Get last server
        // eslint-disable-next-line no-await-in-loop
        const lastServer = await getManager()
          .getRepository(CacheServer)
          .findOne({
            where: {
              tempUUID: player.lastServerUUID,
            },
          });
        if (lastServer === undefined) {
          players[i].online = false;
          // eslint-disable-next-line no-continue
          continue;
        }
        const nowDate = new Date();
        const expire = lastServer.lastUpdate.setSeconds(
          lastServer.lastUpdate.getSeconds() + HardCode.serverGlobalExpireSec
        );
        const now = nowDate.setSeconds(nowDate.getSeconds());
        if (expire > now) {
          players[i].online = true;
        } else {
          players[i].online = false;
        }
      }
      context.body = players;
      next();
    };
  }
}
