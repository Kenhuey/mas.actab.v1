import Dgram from "dgram";
import { commandCodes } from "./codes";
import { BufferCreater, Type } from "../../../utils";
import { Logger, pluginAddress } from "../../../cores";

/**
 * The `CommandHandler` module provides to send command data to Assetto Corsa server
 */
export class CommandHandler {
  /**
   * Command handler server instance
   */
  private readonly serverInstance: Dgram.Socket;

  /**
   * Logging target
   */
  private readonly logger: Logger;

  /**
   * Server meta data
   */
  private readonly metaData: {
    readonly iCommandPort: number;
    readonly iAddress: string;
  };

  /**
   * Constructor
   * @param `logger` - Logging target
   * @param `commandPort` - UDP server command port
   * @param `address` - UDP server listening and command address
   */
  public constructor(
    readonly serverLogger: Logger,
    readonly socketInstance: Dgram.Socket,
    readonly commandPort: number,
    readonly address: string = pluginAddress
  ) {
    // Common resources
    this.logger = serverLogger;
    this.metaData = {
      iCommandPort: commandPort,
      iAddress: address,
    };
    this.serverInstance = socketInstance;
    // Done
    this.logger.info("Command handler created.");
  }

  /**
   * Log info
   * @param `code` - Command code
   * @param `message` - Message
   */
  private logInfo(code: string | number, message: string): this {
    this.logger.info(`[command]: (${code}) ${message}`);
    return this;
  }

  /**
   * Log error
   * @param `code` - Command code
   * @param `message` - Message
   */
  private logError(code: string | number, error: Error | unknown): this {
    this.logger.error(`[command]: (${code}) ${error}`);
    return this;
  }

  /**
   * Send buffer
   * @param `buffer` - Buffer
   * @return `this` Current instance
   */
  private send(buffer: Buffer): this {
    try {
      this.serverInstance.send(
        buffer,
        0,
        buffer.length,
        this.metaData.iCommandPort,
        this.metaData.iAddress
      );
    } catch (error: unknown) {
      this.logger.error(error);
    }
    return this;
  }

  /**
   * SET_REALTIME_POSITION_INTERVAL
   * @param `buffer` - Buffer
   * @return `this` Current instance
   */
  public setRealtimePositionInterval(interval: number): this {
    /**
     * code:            8 bit unsigned integer
     * interval:        16 bit unsigned integer
     */
    try {
      // Checks for params
      if (!Type.isUInt16(interval)) {
        throw new Error(`"${interval}" is not a 16 bit unsigned integer.`);
      }
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer
        .appendUInt8(commandCodes.SET_REALTIME_POSITION_INTERVAL)
        .appendUInt16LE(interval);
      // Send
      this.send(buffer.get);
      this.logInfo(
        commandCodes.SET_REALTIME_POSITION_INTERVAL,
        `Send SET_REALTIME_POSITION_INTERVAL as "${interval}".`
      );
    } catch (error: unknown) {
      this.logError(commandCodes.SET_REALTIME_POSITION_INTERVAL, error);
    }
    // Done
    return this;
  }

  /**
   * GET_CAR_INFO
   * @param `carId` - Car index
   * @return `this` Current instance
   */
  public getCarInfo(carId: number): this {
    /**
     * code:        8 bit unsigned integer
     * carId:       8 bit unsigned integer
     */
    try {
      // Checks for params
      if (!Type.isUInt8(carId)) {
        throw new Error(`"${carId}" is not a 8 bit unsigned integer.`);
      }
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer.appendUInt8(commandCodes.GET_CAR_INFO).appendUInt8(carId);
      // Send
      this.send(buffer.get);
      this.logInfo(
        commandCodes.GET_CAR_INFO,
        `Send GET_CAR_INFO as "${carId}".`
      );
    } catch (error: unknown) {
      this.logError(commandCodes.GET_CAR_INFO, error);
    }
    // Done
    return this;
  }

  /**
   * SEND_CHAT
   * @param `carId` - Car index
   * @param `message` - Message
   * @return `this` Current instance
   */
  public sendChat(carId: number, message: string): this {
    /**
     * code:        8 bit unsigned integer
     * carId:       8 bit unsigned integer
     * length:      8 bit unsigned integer
     * message:     wide string
     */
    try {
      // Checks for params
      if (!Type.isUInt8(carId)) {
        throw new Error(`"${carId}" is not a 8 bit unsigned integer.`);
      }
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer
        .appendUInt8(commandCodes.SEND_CHAT)
        .appendUInt8(carId)
        .appendStringW(message);
      // Send
      this.send(buffer.get);
      this.logInfo(
        commandCodes.SEND_CHAT,
        `Send SEND_CHAT as "${carId}" < "${message}".`
      );
    } catch (error: unknown) {
      this.logError(commandCodes.SEND_CHAT, error);
    }
    // Done
    return this;
  }

  /**
   * SEND_BROADCAST_CHAT
   * @param `message` - Message
   * @return `this` Current instance
   */
  public sendBroadcastChat(message: string): this {
    /**
     * code:        8 bit unsigned integer
     * length:      8 bit unsigned integer
     * message:     wide string
     */
    try {
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer
        .appendUInt8(commandCodes.SEND_BROADCAST_CHAT)
        .appendStringW(message);
      // Send
      this.send(buffer.get);
      this.logInfo(
        commandCodes.SEND_BROADCAST_CHAT,
        `Send SEND_BROADCAST_CHAT as "${message}".`
      );
    } catch (error: unknown) {
      this.logError(commandCodes.SEND_BROADCAST_CHAT, error);
    }
    // Done
    return this;
  }

  /**
   * GET_SESSION_INFO
   * @param `index` - Index of session
   * @return `this` Current instance
   */
  public getSessionInfo(index: number): this {
    /**
     * code:        8 bit unsigned integer
     * index:       16 bit little-endian integer
     */
    try {
      // Checks for params
      if (!Type.isUInt16(index)) {
        throw new Error(`"${index}" is not a 16 bit unsigned integer.`);
      }
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer.appendUInt8(commandCodes.GET_SESSION_INFO).appendUInt16LE(index);
      // Send
      this.send(buffer.get);
      this.logInfo(
        commandCodes.GET_SESSION_INFO,
        `Send GET_SESSION_INFO as "${index}".`
      );
    } catch (error: unknown) {
      this.logError(commandCodes.GET_SESSION_INFO, error);
    }
    // Done
    return this;
  }

  /**
   * SET_SESSION_INFO
   * @param `test` - test
   * @return `this` Current instance
   */
  public setsessionInfo(
    sessionIndex: number,
    name: string,
    type: number,
    lap: number,
    time: number,
    waitTime: number
  ): this {
    /**
     * code:                8 bit unsigned integer
     * sessionIndex:        8 bit unsigned integer
     * name:                wide string
     * type:                8 bit unsigned integer
     * lap:                 32 bit little-endian unsigned integer
     * time:                32 bit little-endian unsigned integer
     * waitTime:            32 bit little-endian unsigned integer
     */
    try {
      // Checks for params
      if (!Type.isUInt8(sessionIndex)) {
        throw new Error(`"${sessionIndex}" is not a 8 bit unsigned integer.`);
      }
      if (!Type.isUInt8(type)) {
        throw new Error(`"${type}" is not a 8 bit unsigned integer.`);
      }
      if (!Type.isUInt32(lap)) {
        throw new Error(`"${lap}" is not a 32 bit unsigned integer.`);
      }
      if (!Type.isUInt32(time)) {
        throw new Error(`"${time}" is not a 32 bit unsigned integer.`);
      }
      if (!Type.isUInt32(waitTime)) {
        throw new Error(`"${waitTime}" is not a 32 bit unsigned integer.`);
      }
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer
        .appendUInt8(commandCodes.SET_SESSION_INFO)
        .appendUInt8(sessionIndex)
        .appendStringW(name)
        .appendUInt8(type)
        .appendUInt32LE(lap)
        .appendUInt32LE(time)
        .appendUInt32LE(waitTime);
      // Send
      this.send(buffer.get);
      this.logInfo(
        commandCodes.SET_SESSION_INFO,
        `Send SET_SESSION_INFO as ${[
          sessionIndex,
          name,
          type,
          lap,
          time,
          waitTime,
        ]}.`
      );
    } catch (error: unknown) {
      this.logError(commandCodes.SET_SESSION_INFO, error);
    }
    // Done
    return this;
  }

  /**
   * KICK_PLAYER
   * @param `carId` - Car index
   * @return `this` Current instance
   */
  public kickPlayer(carId: number): this {
    /**
     * code:        8 bit unsigned integer
     * carId:       8 bit unsigned integer
     */
    try {
      // Checks for params
      if (!Type.isUInt8(carId)) {
        throw new Error(`"${carId}" is not a 8 bit unsigned integer.`);
      }
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer.appendUInt8(commandCodes.KICK_PLAYER).appendUInt8(carId);
      // Send
      this.send(buffer.get);
      this.logInfo(commandCodes.KICK_PLAYER, `Send KICK_PLAYER as "${carId}".`);
    } catch (error: unknown) {
      this.logError(commandCodes.KICK_PLAYER, error);
    }
    // Done
    return this;
  }

  /**
   * NEXT_SESSION
   * @return `this` Current instance
   */
  public nextSession(): this {
    /**
     * code:        8 bit unsigned integer
     */
    try {
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer.appendUInt8(commandCodes.NEXT_SESSION);
      // Send
      this.send(buffer.get);
      this.logInfo(commandCodes.NEXT_SESSION, "Send NEXT_SESSION.");
    } catch (error: unknown) {
      this.logError(commandCodes.NEXT_SESSION, error);
    }
    // Done
    return this;
  }

  /**
   * RESTART_SESSION
   * @return `this` Current instance
   */
  public restartSession(): this {
    /**
     * code:        8 bit unsigned integer
     */
    try {
      // Common resources
      const buffer: BufferCreater = new BufferCreater();
      buffer.appendUInt8(commandCodes.RESTART_SESSION);
      // Send
      this.send(buffer.get);
      this.logInfo(commandCodes.RESTART_SESSION, "Send RESTART_SESSION.");
    } catch (error: unknown) {
      this.logError(commandCodes.RESTART_SESSION, error);
    }
    // Done
    return this;
  }

  /**
   * ADMIN_COMMAND
   * @return `this` Current instance
   */
  public adminCommand(): this {
    /**
     * code:        8 bit unsigned integer
     */
    try {
      // TODO: ...
    } catch (error: unknown) {
      this.logError(commandCodes.RESTART_SESSION, error);
    }
    // Done
    return this;
  }
}
