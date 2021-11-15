import Dgram from "dgram";
import { Connection, getManager } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { ReceiveHandler, CommandHandler } from "./event";
import { Logger, pluginAddress } from "../../cores";
import { AcsConfig } from "../../common";
import { CacheServer } from "../../orm";
import * as HardCode from "../../hardcode";

/**
 * The `UdpServer` module provides plugin's data handlers
 */
export class UdpServer {
  /**
   * UDP server instance
   */
  private readonly serverInstance: Dgram.Socket;

  /**
   * Logging target
   */
  private readonly logger: Logger;

  /**
   * Command handler
   */
  private readonly commandHandler: CommandHandler;

  /**
   * Receiving handler
   */
  private readonly receiveHandler: ReceiveHandler;

  /**
   * Server meta data
   */
  private readonly metaData: {
    readonly iListenPort: number;
    readonly iCommandPort: number;
    readonly iAddress: string;
  };

  private readonly CacheServerUuid: string = uuidv4();

  /**
   * Constructor
   * @param `logger` - Logging target
   * @param `listenPort` - UDP server listening port
   * @param `commandPort` - UDP server command port
   * @param `address` - UDP server listening and command address
   * @param `connection` - ORM connection instance
   * @param `acsCwdPath` - Assetto Corsa Server CWD path
   * @param `acsConfig` - Assetto Corsa Server configs
   */
  public constructor(
    readonly serverLogger: Logger,
    readonly listenPort: number,
    readonly commandPort: number,
    readonly address: string = pluginAddress,
    readonly connection: Connection,
    readonly acsCwdPath: string,
    readonly acsConfig: AcsConfig
  ) {
    // Common resources
    this.logger = serverLogger;
    this.metaData = {
      iListenPort: listenPort,
      iCommandPort: commandPort,
      iAddress: address,
    };
    this.serverInstance = Dgram.createSocket("udp4");
    this.commandHandler = new CommandHandler(
      this.logger,
      this.serverInstance,
      this.metaData.iCommandPort,
      this.metaData.iAddress
    );
    this.receiveHandler = new ReceiveHandler(
      this.logger,
      this.commandHandler,
      connection,
      acsCwdPath,
      acsConfig,
      this.CacheServerUuid
    );
    // Done
    this.logger.info("UDP server created.");
  }

  /**
   * Bind and run server
   * @return `this` Current instance
   */
  public run(): this {
    // Events
    this.serverInstance.on("message", (message: Buffer) => {
      this.receiveHandler.emit(message.readUInt8(0), message);
    });
    this.serverInstance.on("error", (error: Error) => {
      this.logger.error(error);
    });
    this.serverInstance.on("listening", () => {
      this.logger.info(
        `UDP server listening at "${this.metaData.iAddress}:${this.metaData.iListenPort}".`
      );
    });
    // Bind server
    this.serverInstance.bind(this.metaData.iListenPort, this.metaData.iAddress);
    // Start update server
    const that = this;
    async function update() {
      // Update Statu
      const server = await getManager()
        .getRepository(CacheServer)
        .findOne({
          where: {
            tempUUID: that.CacheServerUuid,
          },
        });
      if (server === undefined) {
        const cacheServer: CacheServer = new CacheServer();
        cacheServer.tempUUID = that.CacheServerUuid;
        cacheServer.lastUpdate = new Date();
        cacheServer.serverName = that.acsConfig.NAME;
        that.connection.manager.save(cacheServer).catch((error: unknown) => {
          that.logger.error(error);
        });
      } else {
        server.lastUpdate = new Date();
        server.serverName = that.acsConfig.NAME;
        that.connection.manager.save(server);
      }
    }
    update();
    setInterval(() => {
      update();
    }, 1000 * HardCode.serverGlobalUpdateSec);
    return this;
  }

  /**
   * Close server socket
   * @return `this` Current instance
   */
  public stop(callback?: () => void): this {
    this.serverInstance.close((): void => {
      this.logger.info("UDP server stop.");
      if (callback !== undefined) {
        callback();
      }
    });
    return this;
  }
}
