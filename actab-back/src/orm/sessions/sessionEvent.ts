import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Session } from "./session";

@Entity()
export class SessionEvent {
  @PrimaryColumn()
  readonly UUID: string = uuidv4();

  // eslint-disable-next-line no-unused-vars
  @ManyToOne((_type) => Session, (session) => session.Events)
  Session!: Session;

  @Column()
  Type!: string;

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

  @Column("simple-array", { nullable: true })
  DriverGuidsList!: string[];

  @Column()
  OtherCarId!: number;

  @Column()
  OtherDriverName!: string;

  @Column()
  OtherDriverTeam!: string;

  @Column()
  OtherDriverNation!: string;

  @Column()
  OtherDriverGuid!: string;

  @Column("simple-array", { nullable: true })
  OtherDriverGuidsList!: string[];

  @Column()
  ImpactSpeed!: number;

  @Column()
  WorldPositionX!: number;

  @Column()
  WorldPositionY!: number;

  @Column()
  WorldPositionZ!: number;

  @Column()
  RelPositionX!: number;

  @Column()
  RelPositionY!: number;

  @Column()
  RelPositionZ!: number;
}
