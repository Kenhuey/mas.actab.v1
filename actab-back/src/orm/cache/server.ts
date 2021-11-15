import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class CacheServer {
  @PrimaryColumn()
  tempUUID!: string;

  @Column()
  lastUpdate!: Date;

  @Column()
  serverName!: string;

  @Column()
  lastTrackName: string = "";

  @Column()
  lastTrackLayout: string = "";

  @Column()
  readonly startDate: Date = new Date();
}
