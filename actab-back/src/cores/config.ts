/* eslint-disable import/first */
// Must be define before "config" imported
// TODO: 可以选择配置文件
process.env.NODE_CONFIG_ENV = "server";

import NodeConfig from "config";
import Path from "path";
import FileStream from "fs";
import { Logger } from "./logger";
import { Type, FileUtil } from "../utils";

/**
 * Assetto Corsa configs.
 */
export interface AcConfigs {
  /**
   * UDP_PLUGIN_ADDRESS
   * From example "127.0.0.1:{port}"
   */
  readonly udpPortSender: number;
  /**
   * UDP_PLUGIN_LOCAL_PORT
   * From example "{port}"
   */
  readonly udpPortListen: number;
  /**
   * Directory path of acServer.exe
   */
  readonly path: string;
}

/**
 * Website configs.
 */
export interface WebConfigs {
  /**
   * KOA request port
   */
  readonly apiPort: number;
}

/**
 * MySql configs.
 */
export interface MySqlConfigs {
  /**
   * Server port
   */
  readonly port: number;
  /**
   * Server address
   */
  readonly address: string;
  /**
   * Plugin repository database
   */
  readonly database: string;
  /**
   * Login username
   */
  readonly username: string;
  /**
   * Login password
   */
  readonly password: string;
}

/**
 * All configs.
 */
export interface Configs {
  readonly ac: AcConfigs;
  readonly web: WebConfigs;
  readonly mysql: MySqlConfigs;
}

export const pluginAddress: string = "127.0.0.1";

/**
 * Default configs.
 */
export const CONFIGS_DEFAULT: Configs = {
  ac: {
    udpPortSender: 11000,
    udpPortListen: 12000,
    path: "./server",
  },
  web: {
    apiPort: 8080,
  },
  mysql: {
    port: 3306,
    address: "127.0.0.1",
    database: "actab",
    username: "root",
    password: "root",
  },
};

export const CONFIGS_DIRECTORY_PATH: string = Path.join(
  process.cwd(),
  "/config"
);

/**
 * The `Config` module provides global configs initialization and getter
 */
export class Config {
  /**
   * Global configs.
   */
  private static configs: Configs | undefined = undefined;

  /**
   * Configs getter
   */
  public static get get(): Configs {
    if (Config.configs === undefined) {
      throw new Error("Cannot get configs before initialization.");
    }
    return Config.configs;
  }

  /**
   * Configs initialization
   * @param `logger` - Logging target
   * @return `Config` Current class
   */
  public static initialization(logger: Logger): typeof Config {
    // Create config directory
    FileUtil.createDirectory(CONFIGS_DIRECTORY_PATH)
      .then(() => {
        logger.info(`Created config directory: "${CONFIGS_DIRECTORY_PATH}".`);
      })
      .catch((error: unknown) => {
        throw error;
      });
    // Initialization configs
    if (Config.configs === undefined) {
      // Get and print config information
      const configFileName: string = NodeConfig.util.getEnv("NODE_CONFIG_ENV");
      const configFilePath: string = Path.join(
        CONFIGS_DIRECTORY_PATH,
        `/${configFileName}.json`
      );
      // Write default configs when if configs file not exist
      if (NodeConfig.util.getConfigSources().length === 0) {
        FileStream.writeFileSync(
          configFilePath,
          JSON.stringify(CONFIGS_DEFAULT, null, 4)
        );
        logger.info(
          `Config not found, created default config at "${configFilePath}".`
        );
        throw new Error("Edit configs file and re-start plugin.");
      }
      // Read configs
      const readConfigs: Configs = {
        ac: {
          udpPortSender: ((): number => {
            const configName: string = "ac.udpPortSender";
            if (NodeConfig.has(configName)) {
              const value: number = NodeConfig.get(configName);
              if (Type.isPort(value)) {
                return parseInt(value.toString(), 10);
              }
              throw new Error(
                `Value "${value}" is not a port for "${configName}".`
              );
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
          udpPortListen: ((): number => {
            const configName: string = "ac.udpPortListen";
            if (NodeConfig.has(configName)) {
              const value: number = NodeConfig.get(configName);
              if (Type.isPort(value)) {
                return parseInt(value.toString(), 10);
              }
              throw new Error(
                `Value "${value}" is not a port for "${configName}".`
              );
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
          path: ((): string => {
            const configName: string = "ac.path";
            if (NodeConfig.has(configName)) {
              const value: number = NodeConfig.get(configName);
              return value.toString();
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
        },
        web: {
          apiPort: ((): number => {
            const configName: string = "web.apiPort";
            if (NodeConfig.has(configName)) {
              const value: number = NodeConfig.get(configName);
              if (Type.isPort(value)) {
                return parseInt(value.toString(), 10);
              }
              throw new Error(
                `Value "${value}" is not a port for "${configName}".`
              );
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
        },
        mysql: {
          port: ((): number => {
            const configName: string = "mysql.port";
            if (NodeConfig.has(configName)) {
              const value: number = NodeConfig.get(configName);
              if (Type.isPort(value)) {
                return parseInt(value.toString(), 10);
              }
              throw new Error(
                `Value "${value}" is not a port for "${configName}".`
              );
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
          address: ((): string => {
            const configName: string = "mysql.address";
            if (NodeConfig.has(configName)) {
              const value: string = NodeConfig.get(configName);
              if (Type.isIpv4Addr(value)) {
                return value;
              }
              throw new Error(
                `Value "${value}" is not a ipv4 address for "${configName}".`
              );
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
          database: ((): string => {
            const configName: string = "mysql.database";
            if (NodeConfig.has(configName)) {
              const value: string = NodeConfig.get(configName);
              if (Type.stringEsistSpace(value)) {
                return value;
              }
              throw new Error(
                `Value "${value}" included space in "${configName}"`
              );
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
          username: ((): string => {
            const configName: string = "mysql.username";
            if (NodeConfig.has(configName)) {
              const value: string = NodeConfig.get(configName);
              if (Type.stringEsistSpace(value)) {
                return value;
              }
              throw new Error(
                `Value "${value}" included space in "${configName}"`
              );
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
          password: ((): string => {
            const configName: string = "mysql.password";
            if (NodeConfig.has(configName)) {
              const value: string = NodeConfig.get(configName);
              if (Type.stringEsistSpace(value)) {
                return value;
              }
              throw new Error(
                `Value "${value}" included space in "${configName}"`
              );
            }
            throw new Error(`"${configName}" not set in config.`);
          })(),
        },
      };
      logger.info(`Config found at: "${configFilePath}".`);
      // Checks confliction for ports.
      if (
        Type.numberArrayIsRepeat([
          readConfigs.ac.udpPortSender,
          readConfigs.ac.udpPortListen,
          readConfigs.web.apiPort,
          readConfigs.mysql.port,
        ])
      ) {
        throw new Error("Not allow duplicated port(s) in config.");
      }
      // Done.
      Config.configs = readConfigs;
    } else {
      throw new Error("Not allow multiple initialization of config setting.");
    }
    return Config;
  }
}
