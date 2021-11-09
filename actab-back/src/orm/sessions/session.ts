import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { SessionCar } from "./sessionCar";
import { SessionResult } from "./sessionResult";
import { SessionEvent } from "./sessionEvent";
import { SessionLap } from "./sessionLap";

@Entity()
export class Session {
  @PrimaryColumn()
  readonly UUID: string = uuidv4();

  @Column()
  readonly Date: Date = new Date();

  @Column()
  ServerName!: string;

  @Column()
  FUEL_RATE!: number;

  @Column()
  TYRE_WEAR_RATE!: number;

  @Column()
  ABS_ALLOWED!: number;

  @Column()
  TC_ALLOWED!: number;

  @Column()
  DAMAGE_MULTIPLIER!: number;

  @Column()
  TrackName!: string;

  @Column()
  TrackConfig!: string;

  @Column()
  Type!: string;

  @Column()
  DurationSecs!: number;

  @Column()
  RaceLaps!: number;

  // eslint-disable-next-line no-unused-vars
  @OneToMany((_type) => SessionCar, (sessionCar) => sessionCar.Session)
  Cars!: SessionCar[];

  // eslint-disable-next-line no-unused-vars
  @OneToMany((_type) => SessionResult, (sessionResult) => sessionResult.Session)
  Results!: SessionResult[];

  // eslint-disable-next-line no-unused-vars
  @OneToMany((_type) => SessionLap, (sessionLap) => sessionLap.Session)
  Laps!: SessionLap[];

  // eslint-disable-next-line no-unused-vars
  @OneToMany((_type) => SessionEvent, (sessionEvent) => sessionEvent.Session)
  Events!: SessionEvent[];
}
