import EventEmitter from "events";
import { Connection } from "typeorm";
import { plainToClass } from "class-transformer";
import Path from "path";
import { readFile } from "fs";
import { receiveCodes } from "./codes";
import { BufferReader } from "../../../utils";
import { Logger } from "../../../cores";
import { CommandHandler } from "./send";
import { projectUrl } from "../../../hardcode";
import * as Entities from "../../../orm";
import { AcsConfig } from "../../../common";

/**
 * The `ReceiveHandler` module provides to receving data from Assetto Corsa server
 */
export class ReceiveHandler {
  /**
   * Logging target
   */
  private readonly logger: Logger;

  /**
   * Event emitter instance
   */
  private readonly emitter: EventEmitter;

  /**
   * Command handler
   */
  private readonly commandHandler: CommandHandler;

  /**
   * ORM connection instance
   */
  private readonly dbConnection: Connection;

  /**
   * Assetto Corsa Server CWD path
   */
  private readonly acsCwd: string;

  /**
   * Constructor
   * @param `handlerLogger` - Logging target
   * @param `handlerCommander` - Command handler
   * @param `connection` - ORM connection instance
   * @param `acsCwdPath` - Assetto Corsa Server CWD path
   * @param `acsConfig` - Assetto Corsa Server configs
   */
  public constructor(
    readonly handlerLogger: Logger,
    readonly handlerCommander: CommandHandler,
    readonly connection: Connection,
    readonly acsCwdPath: string,
    readonly acsConfig: AcsConfig
  ) {
    // Common resources
    this.emitter = new EventEmitter();
    this.logger = handlerLogger;
    this.commandHandler = handlerCommander;
    this.dbConnection = connection;
    this.acsCwd = acsCwdPath;
    // Setup events
    this.setupEvents(acsConfig);
    // Done
    this.logger.info("Receive handler created.");
  }

  /**
   * Log info
   * @param `code` - Receiving code
   * @param `message` - Message
   */
  private logInfo(code: string | number, message: string): this {
    this.logger.info(`[receive]: (${code}) ${message}`);
    return this;
  }

  /**
   * Setup events
   * @param `acsConfig` - Assetto Corsa Server configs
   * @return `this` Current instance
   */
  private setupEvents(acsConfig: AcsConfig): this {
    // Common resources
    const that: this = this;
    /**
     * On error
     */
    this.emitter.on("custom-error", (error: Error) => {
      this.logger.error(error);
    });
    /**
     * Handle connections
     * @param `code` - Receving code
     * @param `data` - Receving data
     */
    function connectionHandler(code: string, data: Buffer): void {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse data
        const result = {
          code: reader.nextUInt8(),
          driverNick: reader.nextStringW(),
          driverGuid: reader.nextStringW(),
          carId: reader.nextUInt8(),
          carModel: reader.nextString(),
          carSkin: reader.nextString(),
        };
        // Resolve data
        if (code === receiveCodes.CONNECTION_NEW.toString()) {
          that.logInfo(
            code,
            `User "${result.driverGuid}(${result.driverNick})" connecting server. Using "${result.carModel}(${result.carSkin})" at index "${result.carId}".`
          );
          // Update Users Database
          that.connection.manager
            .getRepository(Entities.Users)
            .findOne({ where: { SteamGUID: result.driverGuid } })
            .then((userRes) => {
              if (userRes !== undefined) {
                userRes.RecentNick = result.driverNick;
                userRes.RecentOnline = new Date();
                that.connection.manager.save(userRes);
              } else {
                const newUser = new Entities.Users();
                newUser.SteamGUID = result.driverGuid;
                newUser.RecentNick = result.driverNick;
                newUser.JoinDate = new Date();
                newUser.RecentOnline = newUser.JoinDate;
                that.connection.manager.save(newUser);
              }
              that.logger.info(
                `User "${result.driverGuid}(${result.driverNick})" updated.`
              );
            });
        } else if (code === receiveCodes.CONNECTION_CLOSE.toString()) {
          that.logInfo(
            code,
            `User "${result.driverGuid}(${result.driverNick})" dissconnect from server. After using "${result.carModel}(${result.carSkin})" at index "${result.carId}".`
          );
        } else {
          throw new Error(`Invalid connection code: "${code}.`);
        }
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    }
    /**
     * CONNECTION_NEW
     * code:          8 bit unsigned integer
     * driverNick:    wide string
     * driverGuid:    wide string
     * carId:         8 bit unsigned integer
     * carModel:      string
     * carSkin:       string
     */
    this.emitter.on(receiveCodes.CONNECTION_NEW.toString(), (data: Buffer) => {
      connectionHandler(receiveCodes.CONNECTION_NEW.toString(), data);
    });
    /**
     * CONNECTION_CLOSE
     * code:          8 bit unsigned integer
     * driverNick:    wide string
     * driverGuid:    wide string
     * carId:         8 bit unsigned integer
     * carModel:      string
     * carSkin:       string
     */
    this.emitter.on(
      receiveCodes.CONNECTION_CLOSE.toString(),
      (data: Buffer) => {
        connectionHandler(receiveCodes.CONNECTION_CLOSE.toString(), data);
      }
    );
    /**
     * Handle sessions
     * @param `code` - Receving code
     * @param `data` - Receving data
     */
    function sessionHandler(code: string, data: Buffer): void {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse data
        const result = {
          code: reader.nextUInt8(),
          version: reader.nextUInt8(),
          sessionIndex: reader.nextUInt8(),
          sessionIndexCurrent: reader.nextUInt8(),
          sessionCount: reader.nextUInt8(),
          serverName: reader.nextStringW(),
          trackName: reader.nextString(),
          trackConfig: reader.nextString(),
          sessionName: reader.nextString(),
          sessionType: reader.nextUInt8(),
          sessionTime: reader.nextUInt16LE(),
          sessionLaps: reader.nextUInt16LE(),
          waitTime: reader.nextUInt16LE(),
          temperatureAmbient: reader.nextUInt8(),
          temperatureRoad: reader.nextUInt8(),
          weatherGraphics: reader.nextString(),
          elapsedMs: reader.nextUInt32LE(),
        };
        // Resolve data
        if (code === receiveCodes.SESSION_NEW.toString()) {
          that.logInfo(
            code,
            `New session "${result.sessionName}" started, using map "${
              result.trackName
            }(${result.trackConfig})" at "${result.serverName}", index at "${
              result.sessionIndexCurrent + 1
            }/${result.sessionCount}(${result.sessionIndexCurrent})".`
          );
        } else if (code === receiveCodes.SESSION_INFO.toString()) {
          that.logInfo(
            code,
            `Get session "${result.sessionName}", using map "${
              result.trackName
            }(${result.trackConfig})" at "${result.serverName}", index at "${
              result.sessionIndexCurrent + 1
            }/${result.sessionCount}(${result.sessionIndexCurrent})".`
          );
        } else {
          throw new Error(`Invalid session code: "${code}.`);
        }
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    }
    /**
     * SESSION_NEW
     * code:                  8 bit unsigned integer
     * version:               8 bit unsigned integer
     * sessionIndex:          8 bit unsigned integer
     * sessionIndexCurrent:   8 bit unsigned integer
     * sessionCount:          8 bit unsigned integer
     * serverName:            wide string
     * trackName:             string
     * trackConfig:           string
     * sessionName:           string
     * sessionType:           8 bit unsigned integer
     * sessionTime:           16 bit little-endian unsigned integer
     * sessionLaps:           16 bit little-endian unsigned integer
     * waitTime:              16 bit little-endian unsigned integer
     * temperatureAmbient:    8 bit unsigned integer
     * temperatureRoad:       8 bit unsigned integer
     * weatherGraphics:       string
     * elapsedMs:             32 bit little-endian unsigned integer
     */
    this.emitter.on(receiveCodes.SESSION_NEW.toString(), (data: Buffer) => {
      sessionHandler(receiveCodes.SESSION_NEW.toString(), data);
    });
    /**
     * SESSION_INFO
     * code:                  8 bit unsigned integer
     * version:               8 bit unsigned integer
     * sessionIndex:          8 bit unsigned integer
     * sessionIndexCurrent:   8 bit unsigned integer
     * sessionCount:          8 bit unsigned integer
     * serverName:            wide string
     * trackName:             string
     * trackConfig:           string
     * sessionName:           string
     * sessionType:           8 bit unsigned integer
     * sessionTime:           16 bit little-endian unsigned integer
     * sessionLaps :          16 bit little-endian unsigned integer
     * waitTime:              16 bit little-endian unsigned integer
     * temperatureAmbient:    8 bit unsigned integer
     * temperatureRoad:       8 bit unsigned integer
     * weatherGraphics:       string
     * elapsedMs:             32 bit little-endian unsigned integer
     */
    this.emitter.on(receiveCodes.SESSION_INFO.toString(), (data: Buffer) => {
      sessionHandler(receiveCodes.SESSION_INFO.toString(), data);
    });
    /**
     * SESSION_INFO
     * code:        8 bit unsigned integer
     * fileName:    wide string
     */
    this.emitter.on(receiveCodes.SESSION_END.toString(), (data: Buffer) => {
      /**
       * `SessionResult` -  ORM prototype
       */
      class SessionResult {
        TrackName!: string; // eg. ks_monza66

        TrackConfig!: string; // eg. junior

        Type!: string; // eg. PRACTICE / RACE / {name}

        DurationSecs!: number; // eg. 0

        RaceLaps!: number; // eg. 0

        Cars!: {
          CarId: number; // eg. 0
          Driver: {
            Name: string; // eg. Kenhuey
            Team: string; // eg. MythsArt_T1
            Nation: string; // eg. ITA
            Guid: string; // eg. 76000000007355608
            GuidsList: string[];
          };
          Model: string; // eg. ks_toyota_gt86
          Skin: string; // eg. 0_fusion_orange
          BallastKG: number; // eg. 0
          Restrictor: number; // eg. 0
        }[];

        Result!: {
          DriverName: string;
          DriverGuid: string;
          CarId: number;
          CarModel: string;
          BestLap: number;
          TotalTime: number; // eg. 114514
          BallastKG: number;
          Restrictor: number;
        }[];

        Laps!: {
          DriverName: string;
          DriverGuid: string;
          CarId: number;
          CarModel: string;
          Timestamp: number;
          LapTime: number;
          Sectors: number[];
          Cuts: number;
          BallastKG: number;
          Tyre: string; // eg. SM
          Restrictor?: number; // eg. 0
        }[];

        Events!: {
          Type: string;
          CarId: number;
          Driver: {
            name: string;
            Team: string;
            Nation: string;
            Guid: string;
            GuidsList: string[];
          };
          OtherCarId: number; // -1 means crash with track environment
          OtherDriver: {
            Name: string;
            Team: string;
            Nation: string;
            Guid: string;
            GuidsList: null | string[];
          };
          ImpactSpeed: number; // KM/H
          WorldPosition: {
            X?: number;
            Y?: number;
            Z?: number;
          };
          RelPosition: {
            X?: number;
            Y?: number;
            Z?: number;
          };
        }[];
      }
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse
        const result = {
          code: reader.nextUInt8(),
          fileName: reader.nextStringW(),
        };
        // Resolve data
        const resultJsonPath: string = Path.join(this.acsCwd, result.fileName);
        readFile(resultJsonPath, (error, jsonData): void => {
          if (error !== undefined && error !== null) {
            throw error;
          }
          // Log
          this.logInfo(
            receiveCodes.SESSION_END.toString(),
            `Session end, see the result file at "${resultJsonPath}".`
          );
          // Plain JSON to class
          const classResult: SessionResult = plainToClass(
            SessionResult,
            jsonData.toString()
          );
          // Set data
          const sessionResultJO = JSON.parse(classResult.toString());
          const sessionEntity = new Entities.Session();
          sessionEntity.TrackName = sessionResultJO.TrackName;
          sessionEntity.TrackConfig = sessionResultJO.TrackConfig;
          sessionEntity.Type = sessionResultJO.Type;
          sessionEntity.DurationSecs = sessionResultJO.DurationSecs;
          sessionEntity.RaceLaps = sessionResultJO.RaceLaps;
          sessionEntity.Cars = (() => {
            const sessionCars: Array<Entities.SessionCar> = new Array(
              sessionResultJO.Cars.length
            );
            for (let i = 0; i < sessionResultJO.Cars.length; i += 1) {
              sessionCars[i] = new Entities.SessionCar();
              sessionCars[i].Session = sessionEntity;
              sessionCars[i].CarId = sessionResultJO.Cars[i].CarId;
              sessionCars[i].DriverName = sessionResultJO.Cars[i].Driver.Name;
              sessionCars[i].DriverTeam = sessionResultJO.Cars[i].Driver.Team;
              sessionCars[i].DriverNation =
                sessionResultJO.Cars[i].Driver.Nation;
              sessionCars[i].DriverGuid = sessionResultJO.Cars[i].Driver.Guid;
              sessionCars[i].DriverGuidsList =
                sessionResultJO.Cars[i].Driver.GuidsList;
              sessionCars[i].Model = sessionResultJO.Cars[i].Model;
              sessionCars[i].Skin = sessionResultJO.Cars[i].Skin;
              sessionCars[i].BallastKG = sessionResultJO.Cars[i].BallastKG;
              sessionCars[i].Restrictor = sessionResultJO.Cars[i].Restrictor;
            }
            return sessionCars;
          })();
          sessionEntity.Results = (() => {
            const sessionResults: Array<Entities.SessionResult> = new Array(
              sessionResultJO.Result.length
            );
            for (let i = 0; i < sessionResultJO.Result.length; i += 1) {
              sessionResults[i] = new Entities.SessionResult();
              sessionResults[i].Session = sessionEntity;
              sessionResults[i].DriverName =
                sessionResultJO.Result[i].DriverName;
              sessionResults[i].DriverGuid =
                sessionResultJO.Result[i].DriverGuid;
              sessionResults[i].CarId = sessionResultJO.Result[i].CarId;
              sessionResults[i].CarModel = sessionResultJO.Result[i].CarModel;
              sessionResults[i].BestLap = sessionResultJO.Result[i].BestLap;
              sessionResults[i].TotalTime = sessionResultJO.Result[i].TotalTime;
              sessionResults[i].BallastKG = sessionResultJO.Result[i].BallastKG;
              sessionResults[i].Restrictor =
                sessionResultJO.Result[i].Restrictor;
            }
            return sessionResults;
          })();
          sessionEntity.Laps = (() => {
            const sessionLaps: Array<Entities.SessionLap> = new Array(
              sessionResultJO.Laps.length
            );
            for (let i = 0; i < sessionResultJO.Laps.length; i += 1) {
              sessionLaps[i] = new Entities.SessionLap();
              sessionLaps[i].Session = sessionEntity;
              sessionLaps[i].DriverName = sessionResultJO.Laps[i].DriverName;
              sessionLaps[i].DriverGuid = sessionResultJO.Laps[i].DriverGuid;
              sessionLaps[i].CarId = sessionResultJO.Laps[i].CarId;
              sessionLaps[i].CarModel = sessionResultJO.Laps[i].CarModel;
              sessionLaps[i].Timestamp = sessionResultJO.Laps[i].Timestamp;
              sessionLaps[i].LapTime = sessionResultJO.Laps[i].LapTime;
              sessionLaps[i].Sectors = sessionResultJO.Laps[i].Sectors;
              sessionLaps[i].Cuts = sessionResultJO.Laps[i].Cuts;
              sessionLaps[i].BallastKG = sessionResultJO.Laps[i].BallastKG;
              sessionLaps[i].Tyre = sessionResultJO.Laps[i].Tyre;
              sessionLaps[i].Restrictor = sessionResultJO.Laps[i].Restrictor;
            }
            return sessionLaps;
          })();
          if (
            sessionResultJO.Events !== undefined &&
            sessionResultJO.Events !== null
          ) {
            sessionEntity.Events = (() => {
              const sessionEvents: Array<Entities.SessionEvent> = new Array(
                sessionResultJO.Events.length
              );
              for (let i = 0; i < sessionResultJO.Events.length; i += 1) {
                sessionEvents[i] = new Entities.SessionEvent();
                sessionEvents[i].Session = sessionEntity;
                sessionEvents[i].Type = sessionResultJO.Events[i].Type;
                sessionEvents[i].CarId = sessionResultJO.Events[i].CarId;
                sessionEvents[i].DriverName =
                  sessionResultJO.Events[i].Driver.Name;
                sessionEvents[i].DriverTeam =
                  sessionResultJO.Events[i].Driver.Team;
                sessionEvents[i].DriverNation =
                  sessionResultJO.Events[i].Driver.Nation;
                sessionEvents[i].DriverGuid =
                  sessionResultJO.Events[i].Driver.Guid;
                sessionEvents[i].DriverGuidsList =
                  sessionResultJO.Events[i].Driver.GuidsList;
                sessionEvents[i].OtherCarId =
                  sessionResultJO.Events[i].OtherCarId;
                sessionEvents[i].OtherDriverName =
                  sessionResultJO.Events[i].OtherDriver.Name;
                sessionEvents[i].OtherDriverTeam =
                  sessionResultJO.Events[i].OtherDriver.Team;
                sessionEvents[i].OtherDriverNation =
                  sessionResultJO.Events[i].OtherDriver.Nation;
                sessionEvents[i].OtherDriverGuid =
                  sessionResultJO.Events[i].OtherDriver.Guid;
                sessionEvents[i].OtherDriverGuidsList =
                  sessionResultJO.Events[i].OtherDriver.GuidsList;
                sessionEvents[i].ImpactSpeed =
                  sessionResultJO.Events[i].ImpactSpeed;
                sessionEvents[i].WorldPositionX =
                  sessionResultJO.Events[i].WorldPosition.X;
                sessionEvents[i].WorldPositionY =
                  sessionResultJO.Events[i].WorldPosition.Y;
                sessionEvents[i].WorldPositionZ =
                  sessionResultJO.Events[i].WorldPosition.Z;
                sessionEvents[i].RelPositionX =
                  sessionResultJO.Events[i].RelPosition.X;
                sessionEvents[i].RelPositionY =
                  sessionResultJO.Events[i].RelPosition.Y;
                sessionEvents[i].RelPositionZ =
                  sessionResultJO.Events[i].RelPosition.Z;
              }
              return sessionEvents;
            })();
          }
          sessionEntity.ServerName = acsConfig.NAME;
          sessionEntity.FUEL_RATE = acsConfig.FUEL_RATE;
          sessionEntity.TYRE_WEAR_RATE = acsConfig.TYRE_WEAR_RATE;
          sessionEntity.TC_ALLOWED = acsConfig.TC_ALLOWED;
          sessionEntity.ABS_ALLOWED = acsConfig.ABS_ALLOWED;
          sessionEntity.DAMAGE_MULTIPLIER = acsConfig.DAMAGE_MULTIPLIER;
          // Save Session
          this.connection.manager
            .save(sessionEntity)
            .then((returnEntity) => {
              this.logger.info(`Session as UUID "${returnEntity.UUID}" saved.`);
            })
            .catch((ormError: unknown) => {
              throw ormError;
            })
            .finally(() => {
              // Save Session Results
              this.connection.manager
                .save(sessionEntity.Results)
                .then((returnEntity) => {
                  this.logger.info(
                    `Session Results(${returnEntity.length}) as UUID "${sessionEntity.UUID}" saved.`
                  );
                })
                .catch((ormError: unknown) => {
                  this.logger.error(ormError);
                })
                .finally(() => {
                  // Save Session Laps
                  this.connection.manager
                    .save(sessionEntity.Laps)
                    .then((returnEntity) => {
                      this.logger.info(
                        `Session Laps(${returnEntity.length}) as UUID "${sessionEntity.UUID}" saved.`
                      );
                    })
                    .catch((ormError: unknown) => {
                      this.logger.error(ormError);
                    })
                    .finally(() => {
                      // Save Session Cars
                      this.connection.manager
                        .save(sessionEntity.Cars)
                        .then((returnEntity) => {
                          this.logger.info(
                            `Session Cars(${returnEntity.length}) as UUID "${sessionEntity.UUID}" saved.`
                          );
                        })
                        .catch((ormError: unknown) => {
                          this.logger.error(ormError);
                        })
                        .finally(() => {
                          // Save Session Events
                          if (
                            sessionEntity.Events !== undefined &&
                            sessionEntity.Events !== null
                          ) {
                            this.connection.manager
                              .save(sessionEntity.Events)
                              .then((returnEntity) => {
                                if (
                                  returnEntity !== undefined ||
                                  returnEntity !== null
                                ) {
                                  this.logger.info(
                                    `Session Events(${returnEntity.length}) as UUID "${sessionEntity.UUID}" saved.`
                                  );
                                }
                              })
                              .catch((ormError: unknown) => {
                                this.logger.error(ormError);
                              });
                          }
                        });
                    });
                });
            });
        });
      } catch (error) {
        that.emitter.emit("custom-error", error);
      }
    });
    /**
     * LAP_COMPLETE
     * code:                        8 bit unsigned integer
     * carId:                       8 bit unsigned integer
     * lapTime:                     32 bit little-endain unsigned integer
     * cuts:                        8 bit unsigned integer
     * carsCount:                   8 bit unsigned integer
     * leaderBoard:                 array
     * leaderBoard[n].carId:        8 bit unsigned integer
     * leaderBoard[n].lapTime:      32 bit little-endain unsigned integer
     * leaderBoard[n].laps:         16 bit little-endain unsigned integer
     * leaderBoard[n].completed:    8 bit unsigned integer()
     * gripLevel:                   little-endain float
     */
    this.emitter.on(receiveCodes.LAP_COMPLETE.toString(), (data: Buffer) => {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        interface LeaderBoard {
          carId: number;
          lapTime: number;
          laps: number;
          completed: number;
        }
        // Parse
        const result: {
          code: number;
          carId: number;
          lapTime: number;
          cuts: number;
          carsCount: number;
          leaderBoard: LeaderBoard[];
          gripLevel: number;
        } = {
          code: reader.nextUInt8(),
          carId: reader.nextUInt8(),
          lapTime: reader.nextUInt32LE(),
          cuts: reader.nextUInt8(),
          carsCount: reader.nextUInt8(),
          leaderBoard: [],
          gripLevel: -1,
        };
        const leaderBoardList: LeaderBoard[] = [];
        Array(result.carsCount)
          .fill(0)
          .forEach(() => {
            leaderBoardList.push({
              carId: reader.nextUInt8(),
              lapTime: reader.nextUInt32LE(),
              laps: reader.nextUInt16LE(),
              completed: reader.nextUInt8(),
            });
          });
        result.leaderBoard = leaderBoardList;
        result.gripLevel = reader.nextFloatLE();
        // Resolve data
        this.logInfo(
          receiveCodes.LAP_COMPLETE.toString(),
          `Car index "${result.carId}" finished a lap, laptime "${
            result.lapTime
          }(${parseInt((result.lapTime / 1000 / 60).toString(), 10)}:${
            Math.round(((result.lapTime / 1000) % 60) * 1000) / 1000
          })", cut(s) "${result.cuts}".`
        );
        // Send lap result
        this.commandHandler.sendChat(
          result.carId,
          `You finished a lap, laptime "${result.lapTime}(${parseInt(
            (result.lapTime / 1000 / 60).toString(),
            10
          )}:${
            Math.round(((result.lapTime / 1000) % 60) * 1000) / 1000
          })", cut(s) "${result.cuts}".`
        );
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    });
    /**
     * VERSION
     * code:      8 bit unsigned integer
     * version:   8 bit unsigned integer
     */
    this.emitter.on(receiveCodes.VERSION.toString(), (data: Buffer) => {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse
        const result = {
          code: reader.nextUInt8(),
          version: reader.nextUInt8(),
        };
        // Resolve data
        this.logInfo(
          receiveCodes.VERSION.toString(),
          `Get version "${result.version}".`
        );
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    });
    /**
     * CHAT
     * code:      8 bit unsigned integer
     * version:   8 bit unsigned integer
     */
    this.emitter.on(receiveCodes.CHAT.toString(), (data: Buffer) => {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse
        const result = {
          code: reader.nextUInt8(),
          carId: reader.nextUInt8(),
          message: reader.nextStringW(),
        };
        // Resolve data
        this.logInfo(
          receiveCodes.CHAT.toString(),
          `Car index "${result.carId}" say: "${result.message}".`
        );
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    });
    /**
     * CLIENT_LOAD
     * code:      8 bit unsigned integer
     * carId:     8 bit unsigned integer
     * message:   wide string
     */
    this.emitter.on(receiveCodes.CLIENT_LOAD.toString(), (data: Buffer) => {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse
        const result = {
          code: reader.nextUInt8(),
          carId: reader.nextUInt8(),
        };
        // Resolve data
        this.logInfo(
          receiveCodes.CLIENT_LOAD.toString(),
          `Client with car index "${result.carId}" loaded.`
        );
        // Send welcome message
        this.commandHandler.sendChat(
          result.carId,
          `AcTab plugin is running, See document and open-source in ${projectUrl}.`
        );
        this.commandHandler.sendChat(
          result.carId,
          `Welcome to this server, your entity index is "${result.carId}".`
        );
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    });
    /**
     * CLIENT_EVENT
     * code:            8 bit unsigned integer
     * eventType:       8 bit unsigned integer
     * carId:           8 bit unsigned integer
     * otherCarId:      8 bit unsigned integer | null
     * impactSpeed:     little-endian float
     * worldPosition:   vector 3 float
     * realPosition:    vector 3 float
     */
    this.emitter.on(receiveCodes.CLIENT_EVENT.toString(), (data: Buffer) => {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse
        const codeTemp = reader.nextUInt8();
        const eventTypeTemp = reader.nextUInt8();
        const result = {
          code: codeTemp,
          eventType: eventTypeTemp,
          carId: reader.nextUInt8(),
          otherCarId:
            eventTypeTemp === receiveCodes.COLLISION_CAR
              ? reader.nextUInt8()
              : -1,
          impactSpeed: reader.nextFloatLE(),
          worldPosition: {
            x: reader.nextFloatLE(),
            y: reader.nextFloatLE(),
            z: reader.nextFloatLE(),
          },
          realPosition: {
            x: reader.nextFloatLE(),
            y: reader.nextFloatLE(),
            z: reader.nextFloatLE(),
          },
        };
        // Resolve data
        // TODO: Update to Redis
        if (eventTypeTemp === receiveCodes.COLLISION_CAR) {
          this.logInfo(
            receiveCodes.COLLISION_CAR.toString(),
            `Car index "${result.carId}" impact car index "${
              result.otherCarId
            }" at position "x:${
              Math.round(result.worldPosition.x * 1000) / 1000
            },y:${Math.round(result.worldPosition.y * 1000) / 1000},z:${
              Math.round(result.worldPosition.z * 1000) / 1000
            }" in speed "${Math.round(result.impactSpeed * 1000) / 1000}km/h".`
          );
        } else if (eventTypeTemp === receiveCodes.COLLISION_ENV) {
          this.logInfo(
            receiveCodes.COLLISION_ENV.toString(),
            `Car index "${result.carId}" impact at position "x:${
              Math.round(result.worldPosition.x * 1000) / 1000
            },y:${Math.round(result.worldPosition.y * 1000) / 1000},z:${
              Math.round(result.worldPosition.z * 1000) / 1000
            }" in speed "${Math.round(result.impactSpeed * 1000) / 1000}km/h".`
          );
        } else {
          throw new Error(`Unknown code: "${eventTypeTemp}".`);
        }
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    });
    /**
     * CAR_UPDATE
     * code:        8 bit unsigned integer
     * carId:       8 bit unsigned integer
     * position:    vector 3 float
     * velocity:    vector 3 float
     * gear:        8 bit unsigned integer
     * rpm:         16 bit little-endain unsigned integer
     * nsp:         vector 3 float (normalized spline position)
     */
    this.emitter.on(receiveCodes.CAR_UPDATE.toString(), (data: Buffer) => {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse
        const result = {
          code: reader.nextUInt8(),
          carId: reader.nextUInt8(),
          position: {
            x: reader.nextFloatLE(),
            y: reader.nextFloatLE(),
            z: reader.nextFloatLE(),
          },
          velocity: {
            x: reader.nextFloatLE(),
            y: reader.nextFloatLE(),
            z: reader.nextFloatLE(),
          },
          gear: reader.nextUInt8(),
          rpm: reader.nextUInt16LE(),
          nsp: reader.nextFloatLE(),
        };
        // Resolve data
        // TODO: Update to Redis
        this.logger.warn(result);
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    });
    /**
     * CAR_INFO
     * code:          8 bit unsigned integer
     * carId          8 bit unsigned integer
     * isConnected:   8 bit unsigned integer (boolean)
     * carModel:      wide string
     * carSkin:       wide string
     * driverName:    wide string
     * driverTeam:    wide string
     * driverGuid :   wide string
     */
    this.emitter.on(receiveCodes.CAR_INFO.toString(), (data: Buffer) => {
      try {
        // Common resources
        const reader: BufferReader = new BufferReader(data);
        // Parse
        const result = {
          code: reader.nextUInt8(),
          carId: reader.nextUInt8(),
          isConnected: reader.nextUInt8() !== 0,
          carModel: reader.nextStringW(),
          carSkin: reader.nextStringW(),
          driverName: reader.nextStringW(),
          driverTeam: reader.nextStringW(),
          driverGuid: reader.nextStringW(),
        };
        // Resolve data
        // TODO:
        this.logger.warn(result);
      } catch (error: unknown) {
        that.emitter.emit("custom-error", error);
      }
    });
    // Done
    return this;
  }

  /**
   * Emit receving data
   * @param `code` - Receving code
   * @param `data` - Receving data
   * @return `this` Current instance
   */
  public emit(code: string | number, data: Buffer): this {
    this.emitter.emit(code.toString(), data);
    return this;
  }
}
