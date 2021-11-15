import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class CachePlayer {
  @PrimaryColumn()
  playerGuid!: string;

  @Column()
  lastServerUUID!: string;

  @Column()
  lastCarId!: number;

  @Column()
  readonly updateDate: Date = new Date();
}
