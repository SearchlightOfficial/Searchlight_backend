import { ColumnOptions } from "typeorm";

export const CREATE_DATE_COLUMN_OPTIONS: ColumnOptions = {
  type: "timestamp",
  insert: false,
  nullable: false,
  select: true,
};

export const UPDATE_DATE_COLUMN_OPTIONS: ColumnOptions = {
  type: "timestamp",
  insert: false,
  nullable: false,
  select: false,
};

export const DELETE_DATE_COLUMN_OPTIONS: ColumnOptions = {
  type: "timestamp",
  insert: false,
  nullable: true,
  select: false,
};
