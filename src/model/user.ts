"use strict";

import { Model, DataTypes, SmallIntegerDataType } from "sequelize";
import { SEQ_CONNECTION } from "../config/db";
import { Cart } from "./cart";

export class Users extends Model {
  public id: number;
  public email: string;
  public password: string;
  public uuid: string;
  public token: string;
  public is_email_verified!: boolean;
  public status: number;
  public created_at: Date;
  public updated_at: Date;
  public profile_status: number;
}
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    token: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    status: {
      type: new DataTypes.SMALLINT(),
      defaultValue: 1,
    },
    language: {
      type: DataTypes.STRING(10),
      defaultValue: "en",
    },
    time_format: {
      type: DataTypes.STRING(10),
      defaultValue: "true",
    },
  },
  {
    tableName: "user",
    sequelize: SEQ_CONNECTION, // this bit is important db refrence
  }
);


