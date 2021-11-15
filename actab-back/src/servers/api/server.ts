import HTTP from "http";
import Koa from "koa";
import KoaRouter from "koa-router";
import KoaRoute from "koa-route";
import websockify from "koa-websocket";
import { Logger, pluginAddress, Configs } from "../../cores";
import { Controllers, WsControllers } from "./controller";

/**
 * The `ApiServer` module provides plugin's APIs
 */
export class ApiServer {
  /**
   * Logging target
   */
  private readonly logger: Logger;

  /**
   * Server instance
   */
  private readonly serverInstance: Koa<Koa.DefaultState, Koa.DefaultContext>;

  private readonly wsServerInstance: websockify.App<
    Koa.DefaultState,
    Koa.DefaultContext
  >;

  /**
   * HTTP instance
   */
  private httpInstance: HTTP.Server | undefined;

  /**
   * Server meta data
   */
  private readonly metaData: {
    readonly iListenPort: number;
    readonly iAddress: string;
    readonly iMysqlAddress: string;
    readonly iMysqlPort: number;
    readonly iMysqlUsername: string;
    readonly iMysqlPassword: string;
    readonly iMysqlDatabase: string;
  };

  private readonly configs: Configs;

  private createRouter(): KoaRouter<any, {}> {
    // Common resources
    const router: KoaRouter<any, {}> = new KoaRouter();
    // Common routes
    router.get("/", new Controllers.RootController().middleware());
    router.get(
      "/sessions",
      new Controllers.GetSessionController().middleware()
    );
    router.get(
      "/sessions/detail",
      new Controllers.GetSessionDetailController().middleware(this.configs)
    );
    router.get(
      "/sessions/cars",
      new Controllers.GetSessionCarController().middleware()
    );
    router.get(
      "/sessions/events",
      new Controllers.GetSessionEventController().middleware()
    );
    router.get(
      "/sessions/laps",
      new Controllers.GetSessionLapController().middleware()
    );
    router.get(
      "/sessions/results",
      new Controllers.GetSessionResultController().middleware()
    );
    router.get(
      "/player/detail",
      new Controllers.GetPlayerDetailController().middleware()
    );
    router.get(
      "/player/statu",
      new Controllers.GetPlayerStatuController().middleware()
    );
    router.get(
      "/players",
      new Controllers.GetAllPlayersController().middleware()
    );
    router.get(
      "/overview",
      new Controllers.GetOverviewController().middleware()
    );
    router.get(
      "/servers/live",
      new Controllers.GetLiveServersController().middleware(this.configs)
    );
    // Done
    return router;
  }

  private createWsRouter(): void {
    // Common routes
    this.wsServerInstance.ws.use(
      KoaRoute.all(
        "/live/map",
        new WsControllers.LiveMapWsController().middleware()
      )
    );
  }

  /**
   * Constructor
   * @param `logger` - Logging target
   * @param `listenPort` - Api server listening port
   * @param `mysqlAddress` - Mysql server host address
   * @param `mysqlPort` - Mysql server host port
   * @param `mysqlUsername` - Username
   * @param `mysqlPassword` - Password
   * @param `mysqlDatabase` - Database name
   * @param `config` - All config
   */
  public constructor(
    readonly serverLogger: Logger,
    readonly listenPort: number,
    readonly mysqlAddress: string,
    readonly mysqlPort: number,
    readonly mysqlUsername: string,
    readonly mysqlPassword: string,
    readonly mysqlDatabase: string,
    readonly config: Configs
  ) {
    // Common resources
    this.logger = serverLogger;
    this.metaData = {
      iListenPort: listenPort,
      iAddress: pluginAddress,
      iMysqlAddress: mysqlAddress,
      iMysqlPort: mysqlPort,
      iMysqlUsername: mysqlUsername,
      iMysqlPassword: mysqlPassword,
      iMysqlDatabase: mysqlDatabase,
    };
    this.serverInstance = new Koa();
    this.wsServerInstance = websockify(this.serverInstance);
    this.configs = config;
    // Set router
    this.serverInstance.use(this.createRouter().routes());
    this.createWsRouter();
  }

  /**
   * Bind and run server
   * @return `this` Current instance
   */
  public run(): this {
    this.httpInstance = HTTP.createServer(this.wsServerInstance.callback());
    // .listen(this.metaData.iListenPort, (): void => {
    //   this.logger.info(
    //     `HTTP API server running at "http:/localhost:${this.metaData.iListenPort}/".`
    //   );
    // });
    this.wsServerInstance.ws.listen({ server: this.httpInstance });
    this.wsServerInstance.listen(this.metaData.iListenPort);
    this.logger.info(
      `HTTP API server running at "http:/localhost:${this.metaData.iListenPort}/".`
    );
    return this;
  }

  /**
   * Close server socket
   * @return `this` Current instance
   */
  public stop(callback?: () => void): this {
    if (this.httpInstance === undefined) {
      throw new Error("Error cannot stop before HTTP server created");
    }
    this.httpInstance.close((error?: Error | undefined) => {
      if (error !== undefined) {
        throw error;
      }
      if (callback !== undefined) {
        callback();
      }
    });
    return this;
  }
}
