import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { v1 } from "uuid";
import {
  CREATE_DATE_COLUMN_OPTIONS,
  UPDATE_DATE_COLUMN_OPTIONS,
  DELETE_DATE_COLUMN_OPTIONS,
} from "../constants/column_options";

@Entity("hospitals")
export class HospitalEntity {
  @PrimaryColumn({ type: "bytea", unique: true })
  uuid: Buffer;

  @Column({
    type: "varchar",
    length: 32,
    unique: true,
    nullable: false,
    update: false,
  })
  id: string;

  @Column({ type: "varchar", length: 80, unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 200, nullable: false, select: false })
  password: string;

  @Column({ type: "varchar", length: 32, unique: true, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  address: string;

  @Column({ type: "float", nullable: false, default: 0 })
  latitude: number;

  @Column({ type: "float", nullable: false, default: 0 })
  longitude: number;

  @CreateDateColumn(CREATE_DATE_COLUMN_OPTIONS)
  createdAt: Date;

  @UpdateDateColumn(UPDATE_DATE_COLUMN_OPTIONS)
  updatedAt: Date;

  @DeleteDateColumn(DELETE_DATE_COLUMN_OPTIONS)
  deletedAt: Date;

  @BeforeInsert()
  setUuid(): void {
    const uuid = v1().split("-");
    this.uuid = Buffer.from(
      uuid[2] + uuid[1] + uuid[0] + uuid[3] + uuid[4],
      "hex",
    );
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
