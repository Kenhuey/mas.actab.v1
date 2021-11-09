export interface AcsConfig {
  readonly NAME: string;
  readonly FUEL_RATE: number; // Fuel eg. 100
  readonly TYRE_WEAR_RATE: number; // Tyre eg. 100
  readonly ABS_ALLOWED: number; // 0-disable 1-enable 2-factory
  readonly TC_ALLOWED: number; // 0-disable 1-enable 2-factory
  readonly DAMAGE_MULTIPLIER: number; // eg. 100
}
