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
import { v1 } from "uuid";
import * as bcrypt from "bcrypt";
import {
  CREATE_DATE_COLUMN_OPTIONS,
  DELETE_DATE_COLUMN_OPTIONS,
  UPDATE_DATE_COLUMN_OPTIONS,
} from "src/constants";

@Entity("admins")
export class AdminEntity {
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

  @Column({ type: "varchar", length: 255, nullable: false, select: false })
  password: string;

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
