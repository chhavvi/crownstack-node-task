"use strict";

import { Model, DataTypes } from "sequelize";
import { SEQ_CONNECTION } from "../config/db";

export class Product extends Model {
  public id: number;
  public name: string;
  public descrtiption: string;
  public uuid: string;
  public status: number;
  public created_at: Date;
  public updated_at: Date;
  public price: number;
  public make: number;
}
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    make: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "product",
    sequelize: SEQ_CONNECTION, // this bit is important db refrence
  }
);
Product.sync();
