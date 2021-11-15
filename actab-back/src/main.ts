import "reflect-metadata";
import { Command, OptionValues } from "commander";
import { Connection } from "typeorm";
import {
  spawn as processSpawn,
  ChildProcessWithoutNullStreams,
} from "child_process";
import Path from "path";
import FileStream from "fs";
import INI from "ini";
import { LoggerFactory, Logger, Config, Configs, pluginAddress } from "./cores";
import { UdpServer, ApiServer } from "./servers";
import { createOrmConnection } from "./orm";
import { AcsConfig } from "./common";

/**
 * Common objects and resources
 */
interface CommonObjects {
  readonly logger: Logger;
  readonly configs: Configs;
}

/**
 * The `initializations` function provides to initialize and get common objects
 * @param `type` - Server type name
 * @return `CommonObjects` Common resources
 */
function initializations(type: string): CommonObjects {
  // Global resources
  LoggerFactory.initialization(type);
  // Get configs
  const mainLogger: Logger = new LoggerFactory("main").logger;
  const mainConfigs: Configs = Config.initialization(mainLogger).get;
  // Set objects
  const commonObjects: CommonObjects = {
    logger: mainLogger,
    configs: mainConfigs,
  };
  return commonObjects;
}

/**
 * The `main` function provides entrance procedures of this program
 */
async function main() {
  try {
    // Get args
    const options: OptionValues = new Command()
      .configureOutput({
        writeOut: (message: string) => console.log(`${message}`),
        writeErr: (message: string) => console.error(`${message}`),
        outputError: (message: string, write) => write(`${message}`),
      })
      .requiredOption("-s, --server <type>")
      .parse(process.argv)
      .opts();
    // Global resources
    const commonObjects: CommonObjects = initializations(options.server);
    // Create ORM connection
    await createOrmConnection(
      commonObjects.configs.mysql.address,
      commonObjects.configs.mysql.port,
      commonObjects.configs.mysql.username,
      commonObjects.configs.mysql.password,
      commonObjects.configs.mysql.database
    )
      .then((connection: Connection) => {
        try {
          // Create server
          if (options.server === "udp") {
            // Set Assetto Corsa executing configs
            const acIniConfig = INI.parse(
              FileStream.readFileSync(
                Path.join(commonObjects.configs.ac.path, "/cfg/server_cfg.ini")
              ).toString()
            );
            const acsConfig: AcsConfig = {
              NAME:
                acIniConfig.SERVER.NAME === undefined
                  ? "Unknown"
                  : acIniConfig.SERVER.NAME,
              FUEL_RATE:
                acIniConfig.SERVER.FUEL_RATE === undefined
                  ? -1
                  : acIniConfig.SERVER.FUEL_RATE,
              TYRE_WEAR_RATE:
                acIniConfig.SERVER.TYRE_WEAR_RATE === undefined
                  ? -1
                  : acIniConfig.SERVER.TYRE_WEAR_RATE,
              ABS_ALLOWED:
                acIniConfig.SERVER.ABS_ALLOWED === undefined
                  ? -1
                  : acIniConfig.SERVER.ABS_ALLOWED,
              TC_ALLOWED:
                acIniConfig.SERVER.TC_ALLOWED === undefined
                  ? -1
                  : acIniConfig.SERVER.TC_ALLOWED,
              DAMAGE_MULTIPLIER:
                acIniConfig.SERVER.DAMAGE_MULTIPLIER === undefined
                  ? -1
                  : acIniConfig.SERVER.DAMAGE_MULTIPLIER,
            };
            acIniConfig.SERVER.UDP_PLUGIN_LOCAL_PORT =
              commonObjects.configs.ac.udpPortSender;
            acIniConfig.SERVER.UDP_PLUGIN_ADDRESS = `127.0.0.1:${commonObjects.configs.ac.udpPortListen}`;
            FileStream.writeFileSync(
              Path.join(commonObjects.configs.ac.path, "/cfg/server_cfg.ini"),
              INI.stringify(acIniConfig)
            );
            // Spawn Assetto Corsa Server
            const acsProcess: ChildProcessWithoutNullStreams = processSpawn(
              Path.join(commonObjects.configs.ac.path, "acServer.exe"),
              {
                cwd: commonObjects.configs.ac.path,
              }
            );
            // Create UDP server
            const udpServer: UdpServer = new UdpServer(
              commonObjects.logger,
              commonObjects.configs.ac.udpPortListen,
              commonObjects.configs.ac.udpPortSender,
              pluginAddress,
              connection,
              commonObjects.configs.ac.path,
              acsConfig
            );
            // Process events
            acsProcess
              .on("message", (data): void => {
                commonObjects.logger.info(`[ACS]: ${data}`);
              })
              .on("spawn", (): void => {
                udpServer.run();
              })
              .on("close", (code: number) => {
                udpServer.stop((): void => {
                  commonObjects.logger.info(
                    `Assetto Corsa server process exit, code: "${code}".`
                  );
                  connection.close();
                });
              })
              .on("error", (error: unknown): void => {
                udpServer.stop();
                throw error;
              });
            // Standard output
            acsProcess.stdout.on("data", (data) => {
              process.stdout.write(`raw - [acs]: ${data}`);
            });
          } else if (options.server === "api") {
            // Create API server
            const apiServer: ApiServer = new ApiServer(
              commonObjects.logger,
              commonObjects.configs.web.apiPort,
              commonObjects.configs.mysql.address,
              commonObjects.configs.mysql.port,
              commonObjects.configs.mysql.username,
              commonObjects.configs.mysql.password,
              commonObjects.configs.mysql.database,
              commonObjects.configs
            );
            try {
              apiServer.run();
            } catch (apiError: unknown) {
              apiServer.stop();
              throw apiError;
            }
          } else {
            throw new Error(`Unknown server name: "${options.server}".`);
          }
        } catch (error: unknown) {
          connection.close();
          throw error;
        }
      })
      .catch((error: unknown) => {
        commonObjects.logger.info(error);
      });
    process.exitCode = 0;
  } catch (error: unknown) {
    console.error(error);
    console.info("Plugin server un-expected stopped.");
    setTimeout(() => {
      process.exit(-1);
    }, 2000);
  }
}

// Run plugin
main();
