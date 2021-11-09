import Log4js from "log4js";

export type Logger = Log4js.Logger;

/**
 * The `LoggerFactory` module provides global loggers initialization and custom loggers
 */
export class LoggerFactory {
  /**
   * Console logger
   */
  private static consoleLogger: Log4js.Logger | undefined = undefined;

  /**
   * Console logger getter
   * @return `Logger` Current console logger
   */
  public static get get(): Logger {
    if (LoggerFactory.consoleLogger === undefined) {
      throw new Error("Cannot get global logger before initialization.");
    }
    return LoggerFactory.consoleLogger;
  }

  /**
   * Configs and console logger initialization
   * @param `name` - Console log name
   * @return `LoggerFactory` Current class
   */
  public static initialization(name: string): typeof LoggerFactory {
    if (LoggerFactory.consoleLogger !== undefined) {
      return LoggerFactory;
    }
    // Configs
    const datePattern: String =
      "[%d{yyyy-MM-dd hh:mm:ss}] [%p] <%h %z> %c - %m";
    Log4js.configure({
      appenders: {
        file: {
          type: "dateFile",
          filename: `logs/${name}/output`,
          pattern: "yyyy-MM-dd.log",
          alwaysIncludePattern: true,
          encoding: "utf-8",
          layout: {
            type: "pattern",
            pattern: datePattern,
          },
        },
        console: {
          type: "console",
          layout: {
            type: "pattern",
            pattern: datePattern,
          },
        },
      },
      categories: {
        default: {
          appenders: ["console", "file"],
          level: "ALL",
          enableCallStack: true,
        },
      },
    });
    // Replace default console output levels
    LoggerFactory.consoleLogger = Log4js.getLogger("console");
    console.log = LoggerFactory.consoleLogger.info.bind(
      LoggerFactory.consoleLogger
    );
    console.info = LoggerFactory.consoleLogger.info.bind(
      LoggerFactory.consoleLogger
    );
    console.warn = LoggerFactory.consoleLogger.warn.bind(
      LoggerFactory.consoleLogger
    );
    console.error = LoggerFactory.consoleLogger.error.bind(
      LoggerFactory.consoleLogger
    );
    console.trace = LoggerFactory.consoleLogger.trace.bind(
      LoggerFactory.consoleLogger
    );
    console.debug = LoggerFactory.consoleLogger.debug.bind(
      LoggerFactory.consoleLogger
    );
    // Done
    return LoggerFactory;
  }

  /**
   * Custom logger
   */
  private customLogger: Logger;

  /**
   * Custom logger getter
   * @returns `Logger` Current logger instance
   */
  public get logger(): Logger {
    return this.customLogger;
  }

  /**
   * Constructor
   * @param `loggerName` Logger name
   */
  public constructor(loggerName: string) {
    if (LoggerFactory.consoleLogger === undefined) {
      throw new Error("Logger cannot use before initialization.");
    }
    this.customLogger = Log4js.getLogger(loggerName);
  }
}
