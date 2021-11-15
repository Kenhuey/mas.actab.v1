import { Context } from "koa";
import { getManager } from "typeorm";
import { BaseWsController } from "..";
import * as Entities from "../../../../orm";
import * as HardCode from "../../../../hardcode";

export class LiveMapWsController extends BaseWsController {
  public middleware() {
    return async (context: Context) => {
      // Get live server uuid
      const { serverUuid } = context.request.query;
      if (serverUuid === undefined) {
        context.websocket.close();
      }
      const server = await getManager()
        .getRepository(Entities.CacheServer)
        .findOne({
          where: {
            tempUUID: serverUuid,
          },
        });
      if (server === undefined) {
        context.websocket.close();
        return;
      }
      // Checks for expire
      const nowDate = new Date();
      const expire = server.lastUpdate.setSeconds(
        server.lastUpdate.getSeconds() + HardCode.serverGlobalExpireSec
      );
      const now = nowDate.setSeconds(nowDate.getSeconds());
      if (expire < now) {
        context.websocket.close();
        return;
      }
      // Send live position
      async function send() {
        const positions: any[] = await getManager()
          .getRepository(Entities.CachePosition)
          .find({
            where: {
              serverUUID: serverUuid,
            },
            order: { carId: "ASC" },
          });
        if (positions === undefined || positions.length === 0) {
          context.websocket.send(JSON.stringify([]));
        } else {
          for (let i = 0; i < positions.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const cachePlayer = await getManager()
              .getRepository(Entities.CachePlayer)
              .findOne({
                where: {
                  lastServerUUID: serverUuid,
                  lastCarId: i,
                },
                order: {
                  updateDate: "DESC",
                },
              });
            positions[i].playerGuid = cachePlayer?.playerGuid;
            // eslint-disable-next-line no-await-in-loop
            const player = await getManager()
              .getRepository(Entities.Users)
              .findOne({
                where: {
                  SteamGUID: cachePlayer?.playerGuid,
                },
              });
            positions[i].playerNick = player?.RecentNick;
          }
          context.websocket.send(JSON.stringify(positions));
        }
      }
      send();
      setInterval(send, 1000 * HardCode.mapRefresh);
    };
  }
}
