import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Users {
  @PrimaryColumn()
  SteamGUID!: string;

  @Column()
  RecentNick!: string;

  @Column()
  JoinDate!: Date;

  @Column()
  RecentOnline!: Date;
}
