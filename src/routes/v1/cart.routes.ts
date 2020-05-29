import * as express from "express";
import { celebrate, Joi, errors } from "celebrate";
import { CartClass } from "../../entities/cart";
import * as CONSTANTS from "../../constants";
import { sendError, copyObject } from "../../utils/UniversalFunc";
import * as Middlewares from "../../middlewares";
const Cart = new CartClass();
const router = express.Router();

/**
 * route to add product to cart
 */

router.post(
  "/",
  Middlewares.Authorize.Authenticate,
  Middlewares.Authorize.UserAuth,
  celebrate(
    {
      body: Joi.object().keys({
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  async (req, res, next) => {
    try {
      let response = await Cart.addProductToCart(req.body, req["userDetail"]);
      let responseData = copyObject(CONSTANTS.SUCCESS.POST_201_DATA);
      responseData.data = response;
      responseData.message = CONSTANTS.SUCCESS_MESSAGE.PRODUCT_ADDED_TO_SUCCESS;
      res.status(responseData.code).send(responseData);
    } catch (error) {
      await sendError(error, res);
    }
  }
);

/**
 * route to get product in cart for user
 */
router.get(
  "/user-products",
  Middlewares.Authorize.Authenticate,
  Middlewares.Authorize.UserAuth,
  celebrate(
    {
      query: Joi.object().keys({
        limit: Joi.string().trim().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  async (req, res, next) => {
    try {
      let response = await Cart.userCartProducts(req.query, req["userDetail"]);
      let responseData = copyObject(CONSTANTS.SUCCESS.GET_200_DATA);
      responseData.data = response;
      responseData.message = CONSTANTS.SUCCESS_MESSAGE.USERCART_LIST_SUCCESS;
      res.status(responseData.code).send(responseData);
    } catch (error) {
      await sendError(error, res);
    }
  }
);
router.use(errors());
module.exports = router;
