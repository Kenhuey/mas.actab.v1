import { ParameterizedContext, Next } from "koa";
import { IRouterParamContext } from "koa-router";
import { getManager, Not } from "typeorm";
import { BaseController, setCommonHeader } from "..";
import {
  Session,
  SessionCar,
  SessionEvent,
  SessionLap,
  SessionResult,
  Users,
} from "../../../../orm";

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
  public middleware() {
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
      context.body = {
        sessionInfo: session,
        sessionCars: cars,
        sessionEvents: events,
        sessionLaps: laps,
        sessionResults: results,
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

export class GetAllPlayersController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      context.body = await getManager()
        .getRepository(Users)
        .find({ order: { JoinDate: "DESC" } });
      next();
    };
  }
}
