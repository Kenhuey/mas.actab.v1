import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Session } from "./session";

@Entity()
export class SessionResult {
  @PrimaryColumn()
  readonly UUID: string = uuidv4();

  // eslint-disable-next-line no-unused-vars
  @ManyToOne((_type) => Session, (session) => session.Results)
  Session!: Session;

  @Column()
  DriverName!: string;

  @Column()
  DriverGuid!: string;

  @Column()
  CarId!: number;

  @Column()
  CarModel!: string;

  @Column()
  BestLap!: number;

  @Column()
  TotalTime!: number;

  @Column()
  BallastKG!: number;

  @Column()
  Restrictor!: number;
}
