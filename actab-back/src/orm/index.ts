import { createConnection, Connection } from "typeorm";
import { Session } from "./sessions/session";
import { SessionCar } from "./sessions/sessionCar";
import { SessionLap } from "./sessions/sessionLap";
import { SessionEvent } from "./sessions/sessionEvent";
import { SessionResult } from "./sessions/sessionResult";
import { Users } from "./users";
import { CacheServer } from "./cache/server";
import { CachePlayer } from "./cache/player";
import { CachePosition } from "./cache/position";

export { Session, SessionCar, SessionEvent, SessionLap, SessionResult };
export { Users };
export { CacheServer };
export { CachePlayer };
export { CachePosition };

/**
 * The `createOrmConnection` function provides ORM connection promise
 */
export async function createOrmConnection(
  fHost: string,
  fPort: number,
  fIusername: string,
  fIpassword: string,
  fIdatabase: string
): Promise<Connection> {
  return createConnection({
    type: "mysql",
    host: fHost,
    port: fPort,
    username: fIusername,
    password: fIpassword,
    database: fIdatabase,
    entities: [
      Session,
      SessionEvent,
      SessionLap,
      SessionResult,
      SessionCar,
      Users,
      CacheServer,
      CachePlayer,
      CachePosition,
    ],
    synchronize: true,
    logging: ["error", "info", "log", "warn", "migration", "schema"],
    // logging: "all",
    logger: "simple-console",
  });
}
