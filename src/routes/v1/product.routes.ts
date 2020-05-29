import * as express from "express";
import { celebrate, Joi, errors } from "celebrate";
import { ProductClass } from "../../entities/product";
import * as CONSTANTS from "../../constants";
import { sendError, copyObject } from "../../utils/UniversalFunc";
import * as Middlewares from "../../middlewares";
const Product = new ProductClass();
const router = express.Router();

router.post(
  "/",
  Middlewares.Authorize.Authenticate,
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().trim().required(),
        price: Joi.number().required(),
        make: Joi.number().required(),
        description: Joi.string().trim().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  async (req, res, next) => {
    try {
      let response = await Product.addProduct(req.body);
      let responseData = copyObject(CONSTANTS.SUCCESS.POST_201_DATA);
      responseData.data = response;
      responseData.message = CONSTANTS.SUCCESS_MESSAGE.PRODUCT_ADDED_SUCCESS;
      res.status(responseData.code).send(responseData);
    } catch (error) {
      await sendError(error, res);
    }
  }
);

router.get(
  "/",
  Middlewares.Authorize.Authenticate,
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
      let response = await Product.listProduct(req.query);
      let responseData = copyObject(CONSTANTS.SUCCESS.GET_200_DATA);
      responseData.data = response;
      responseData.message = CONSTANTS.SUCCESS_MESSAGE.PRODUCT_LIST_FETCHED;
      res.status(responseData.code).send(responseData);
    } catch (error) {
      await sendError(error, res);
    }
  }
);
router.use(errors());
module.exports = router;
