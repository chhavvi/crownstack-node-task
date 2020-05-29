"use strict";

import { Model, DataTypes, SmallIntegerDataType } from "sequelize";
import { SEQ_CONNECTION } from "../config/db";
import { Product } from "./product";
import { Users } from "./user";

export class Cart extends Model {
  public id: number;
  public user_id: string;
  public product_id: string;
  public uuid: string;
  public status: number;
  public created_at: Date;
  public updated_at: Date;
}
Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
    },
    product_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "cart",
    sequelize: SEQ_CONNECTION,
  }
);
Cart.sync();

Product.hasMany(Cart, {
  foreignKey: "product_id",
});
Cart.belongsTo(Product, {
  foreignKey: "product_id",
});
