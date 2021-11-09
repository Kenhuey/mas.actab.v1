/**
 * UDP server receiving codes define
 */
export interface ReceiveCodes {
  // Session
  readonly SESSION_NEW: number;
  readonly SESSION_END: number;
  readonly SESSION_INFO: number;
  // Connection
  readonly CONNECTION_NEW: number;
  readonly CONNECTION_CLOSE: number;
  // Car
  readonly CAR_UPDATE: number;
  readonly CAR_INFO: number;
  // Message
  readonly LAP_COMPLETE: number;
  readonly VERSION: number;
  readonly CHAT: number;
  readonly CLIENT_LOAD: number;
  readonly CLIENT_EVENT: number;
  readonly ERROR: number;
  // Collision event
  readonly COLLISION_CAR: number;
  readonly COLLISION_ENV: number;
}

/**
 * UDP server receiving codes
 */
export const receiveCodes: ReceiveCodes = {
  SESSION_NEW: 50,
  SESSION_END: 55,
  SESSION_INFO: 59,
  CONNECTION_NEW: 51,
  CONNECTION_CLOSE: 52,
  CAR_UPDATE: 53,
  CAR_INFO: 54,
  LAP_COMPLETE: 73,
  VERSION: 56,
  CHAT: 57,
  CLIENT_LOAD: 58,
  CLIENT_EVENT: 130,
  ERROR: 60,
  COLLISION_CAR: 10,
  COLLISION_ENV: 11,
};

/**
 * UDP server command codes define
 */
export interface CommandCodes {
  readonly SET_REALTIME_POSITION_INTERVAL: number;
  readonly GET_CAR_INFO: number;
  readonly SEND_CHAT: number;
  readonly SEND_BROADCAST_CHAT: number;
  readonly GET_SESSION_INFO: number;
  readonly SET_SESSION_INFO: number;
  readonly KICK_PLAYER: number;
  readonly NEXT_SESSION: number;
  readonly RESTART_SESSION: number;
  readonly ADMIN_COMMAND: number;
}

/**
 * UDP server command codes
 */
export const commandCodes: CommandCodes = {
  SET_REALTIME_POSITION_INTERVAL: 200,
  GET_CAR_INFO: 201,
  SEND_CHAT: 202,
  SEND_BROADCAST_CHAT: 203,
  GET_SESSION_INFO: 204,
  SET_SESSION_INFO: 205,
  KICK_PLAYER: 206,
  NEXT_SESSION: 207,
  RESTART_SESSION: 208,
  ADMIN_COMMAND: 209,
};
