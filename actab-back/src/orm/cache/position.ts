import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class CachePosition {
  @PrimaryColumn()
  tempUUID!: string;

  @Column()
  serverUUID!: string;

  @Column()
  carId!: number;

  @Column()
  positionX!: number;

  @Column()
  positionY!: number;

  @Column()
  positionZ!: number;

  @Column()
  readonly updateDate: Date = new Date();
}
