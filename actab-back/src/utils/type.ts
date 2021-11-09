/**
 * Checks for integer
 * @param `value` - Value to check
 * @return `boolean` Value correction
 */
export function isInt(value: number): boolean {
  return value % 1 === 0;
}

/**
 * Checks for 8 bit unsigned integer
 * @param `value` - Value to check
 * @return `boolean` Value correction
 */
export function isUInt8(value: number): boolean {
  if (!isInt(value)) return false;
  return value >= 0 && value <= 256;
}

/**
 * Checks for 16 bit unsigned integer
 * @param `value` - Value to check
 * @return `boolean` Value correction
 */
export function isUInt16(value: number): boolean {
  if (!isInt(value)) return false;
  return value >= 0 && value <= 65535;
}

/**
 * Checks for 16 bit unsigned integer
 * @param `value` - Value to check
 * @return `boolean` Value correction
 */
export function isUInt32(value: number): boolean {
  if (!isInt(value)) return false;
  return value >= 0 && value <= 4294967295;
}

/**
 * Unsigned short integer range
 */
export const uShortIntRange = {
  min: 0,
  max: 65535,
};

/**
 * Checks for port
 * @param `value` - Value to check
 * @return `boolean` Value correction
 */
export function isPort(value: number): boolean {
  return (
    isInt(value) && value < uShortIntRange.max && value > uShortIntRange.min
  );
}

/**
 * Checks for number array repeats
 * @param `value` - Value to check
 * @return `boolean` Value correction
 */
export function numberArrayIsRepeat(value: Array<number>): boolean {
  const hash = {};
  for (let i = 0; i < value.length; i += 1) {
    if ((hash as any)[value[i]]) return true;
    (hash as any)[value[i]] = true;
  }
  return false;
}

/**
 * Checks for string spaces existent
 * @param `value` - Value to check
 * @return `boolean` Value correction
 */
export function stringEsistSpace(value: string): boolean {
  return value.indexOf(" ") === -1;
}

/**
 * Checks for ip address
 * @param `value` - Value to check
 * @return `boolean` Value correction
 */
export function isIpv4Addr(value: string): boolean {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const reg: RegExp = RegExp(ipv4Regex);
  return reg.test(value);
}
