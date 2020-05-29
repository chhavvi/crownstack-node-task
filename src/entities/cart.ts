import { Cart, Product } from "../model";
import * as CONSTANTS from "../constants";
import { AddProductToCart, UserToken } from "../interfaces";
export class CartClass {
  /**
   * adding Product in system
   * @param params  //param for cart product
   * @param user   //token data
   */
  async addProductToCart(params: AddProductToCart, user: UserToken) {
    try {
      let result;
      //check if that product exist in user cart
      const cartExist = await Cart.findOne({
        where: {
          user_id: user.user_id,
          product_id: params.productId,
          status: CONSTANTS.APP.STATUS.ACTIVE,
        },
        include: [{ model: Product }],
        raw: true,
      });

      if (cartExist && cartExist != null) {
        //if  product exist just add quantity and price
        const totalPrice =
          cartExist["total_price"] +
          cartExist["Product.price"] * params.quantity;

        const totalQuantity = cartExist.product_qty + params.quantity;

        // cartExist["Product.price"] * params.quantity;
        //update the Cart
        const updatedCartResult = await Cart.update(
          { product_qty: totalQuantity, total_price: totalPrice },
          {
            where: {
              id: cartExist.id,
            },
            returning: true, //used to get the response of update
          }
        );
        result = updatedCartResult[1][0];
      } else {
        //if product doesnot exist in users cart

        //get product details
        const productDetail = await Product.findOne({
          where: { id: params.productId, status: CONSTANTS.APP.STATUS.ACTIVE },
          raw: true,
        });

        const cartObj = {
          user_id: user.user_id,
          product_id: params.productId,
          product_qty: params.quantity,
          total_price: productDetail.price * params.quantity,
        };

        //add product in user's cart
        result = await Cart.create(cartObj);
      }
      return result;
    } catch (err) {
      console.error("error in function", err);
      throw new Error(err);
    }
  }

  /**
   * @function userCartProducts
   * @description get the user cart's product
   * @param payload limit
   * @param user  token data
   */
  async userCartProducts(payload, user: UserToken) {
    try {
      //get cart Details for user
      const userCartProducts = await Cart.findAll({
        where: {
          user_id: user.user_id,
          status: CONSTANTS.APP.STATUS.ACTIVE,
        },
        include: [
          {
            model: Product,
            attributes: ["name", "make", "price", "description", "uuid"],
          },
        ],
        limit: payload.limit,
        raw: true,
      });
      return userCartProducts;
    } catch (error) {
      throw error;
    }
  }
}
