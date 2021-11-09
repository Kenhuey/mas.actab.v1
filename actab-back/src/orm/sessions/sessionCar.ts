import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Session } from "./session";

@Entity()
export class SessionCar {
  @PrimaryColumn()
  readonly UUID: string = uuidv4();

  // eslint-disable-next-line no-unused-vars
  @ManyToOne((_type) => Session, (session) => session.Cars)
  Session!: Session;

  @Column()
  CarId!: number;

  @Column()
  DriverName!: string;

  @Column()
  DriverTeam!: string;

  @Column()
  DriverNation!: string;

  @Column()
  DriverGuid!: string;

  @Column("simple-array")
  DriverGuidsList!: string[];

  @Column()
  Model!: string;

  @Column()
  Skin!: string;

  @Column()
  BallastKG!: number;

  @Column()
  Restrictor!: number;
}
