import * as express from "express";
import { celebrate, Joi, errors } from "celebrate";
import { UserClass } from "../../entities/user";
import * as CONSTANTS from "../../constants";
import { sendError, copyObject } from "../../utils/UniversalFunc";
import * as Middlewares from "../../middlewares";
const User = new UserClass();
const router = express.Router();

router.post(
  "/signup",
  Middlewares.Authorize.Authenticate,
  celebrate(
    {
      body: Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string()
          .trim()
          .required()
          .min(8)
          .error(() => CONSTANTS.ERROR_MESSAGE.PASSWORD_REQUIREMENT),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  async (req, res, next) => {
    try {
      let response = await User.signUpUser(req.body);
      let responseData = copyObject(CONSTANTS.SUCCESS.POST_201_DATA);
      responseData.data = response;
      responseData.message = CONSTANTS.SUCCESS_MESSAGE.SIGNUP_SUCCESS;
      res.status(responseData.code).send(responseData);
    } catch (error) {
      await sendError(error, res);
    }
  }
);

router.post(
  "/login",
  Middlewares.Authorize.Authenticate,
  celebrate(
    {
      body: Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string()
          .trim()
          .required()
          .min(8)
          .error(() => CONSTANTS.ERROR_MESSAGE.INCORRECT_PASSWORD),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  async (req, res, next) => {
    try {
      let response = await User.signInUser(req.body);
      let responseData = copyObject(CONSTANTS.SUCCESS.GET_200_DATA);
      responseData.data = response;
      responseData.message = CONSTANTS.SUCCESS_MESSAGE.LOGIN_SUCCESS;
      res.status(responseData.code).send(responseData);
    } catch (error) {
      await sendError(error, res);
    }
  }
);
router.use(errors());
module.exports = router;
