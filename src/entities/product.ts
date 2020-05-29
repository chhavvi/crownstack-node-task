import { Product } from "../model";
import * as CONSTANTS from "../constants";
import { List, AddProduct } from "../interfaces";

export class ProductClass {
  /**
   * adding Product in system
   * @param params
   */
  async addProduct(params: AddProduct) {
    try {
      // find product if exist in db
      const productDetail = await Product.findOne({
        where: { name: params.name, status: CONSTANTS.APP.STATUS.ACTIVE },
        raw: true,
      });
      if (!productDetail) {
        //if not exit create product
        return await Product.create(params);
      } else {
        //return the already exist error
        return Promise.reject({
          message: CONSTANTS.ERROR_MESSAGE.PRODUCT_ALREADY_EXIST,
          code: 409,
        });
      }
    } catch (err) {
      console.error("error in addProduct function", err);
      throw new Error(err);
    }
  }

  /**
   * listing Product
   * @param params
   */

  async listProduct(param: List) {
    try {
      //get the product list from db
      const activeProducts = await Product.findAll({
        where: { status: CONSTANTS.APP.STATUS.ACTIVE },
        limit: param.limit,
        order: [["name", "asc"]], //order by name ascending
        raw: true,
      });
      return activeProducts;
    } catch (error) {
      console.error("error in listProduct function", error);
      throw error;
    }
  }
}
