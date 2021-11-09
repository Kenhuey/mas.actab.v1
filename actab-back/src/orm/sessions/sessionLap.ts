import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Session } from "./session";

@Entity()
export class SessionLap {
  @PrimaryColumn()
  readonly UUID: string = uuidv4();

  // eslint-disable-next-line no-unused-vars
  @ManyToOne((_type) => Session, (session) => session.Laps)
  Session!: Session;

  @Column()
  readonly lapFinishTempDate: Date = new Date();

  @Column()
  DriverName!: string;

  @Column()
  DriverGuid!: string;

  @Column()
  CarId!: number;

  @Column()
  CarModel!: string;

  @Column()
  Timestamp!: number;

  @Column()
  LapTime!: number;

  @Column("simple-array")
  Sectors!: number[];

  @Column()
  Cuts!: number;

  @Column()
  BallastKG!: number;

  @Column()
  Tyre!: string;

  @Column()
  Restrictor!: number;
}
