import * as auth from "basic-auth";
import { APP } from "../config/app";
import * as CONSTANTS from "../constants";
import { copyObject } from "./../utils/UniversalFunc";
import * as JWT from "jsonwebtoken";
export class Authorize {
  static async Authenticate(req, res, next) {
    // extract the name and password from basic authorization
    const credentials = auth(req);

    // verify the authorization credentials
    if (
      credentials &&
      credentials.name === APP.BASE_AUTH.USERNAME &&
      credentials.pass === APP.BASE_AUTH.PASSWORD
    ) {
      next();
    } else {
      const errorData = copyObject(CONSTANTS.ERROR.UNAUTHORIZED_401);
      errorData.message = CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED;
      return res.status(errorData.code).send(errorData);
    }
  }
  static async UserAuth(req, res, next) {
    try {
      let toDecodeString = process.env.JWT_DECODE_STRING;
      if (req.headers["accesstoken"]) {
        const token = req.headers["accesstoken"];
        const headerType = String(token).split(" ")[0];
        const headerToken = String(token).split(" ")[1];
        if (headerType === "bearer" && headerToken !== "") {
          JWT.verify(headerToken, toDecodeString, async (err, decoded: any) => {
            if (err) {
              const errorData = copyObject(CONSTANTS.ERROR.UNAUTHORIZED_401);
              errorData.message = CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED;
              return res.status(errorData.code).send(errorData);
            } else {
              req.userDetail = decoded;
              next();
            }
          });
        } else {
          const errorData = copyObject(CONSTANTS.ERROR.UNAUTHORIZED_401);
          errorData.message = CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED;
          return res.status(errorData.code).send(errorData);
        }
      } else {
        const errorData = copyObject(CONSTANTS.ERROR.UNAUTHORIZED_401);
        errorData.message = CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED;
        return res.status(errorData.code).send(errorData);
      }
    } catch (error) {
      throw error;
    }
  }
}
