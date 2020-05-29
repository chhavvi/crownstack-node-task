import * as CONFIG from "../config";
import * as CONSTANTS from "../constants";
import * as randomstring from "randomstring";
import * as bcrypt from "bcrypt";
export const copyObject = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};
export const sendError = function (errors: any, res: any) {
  if (Array.isArray(errors)) {
    CONSTANTS.ERROR.VALIDATION_ERROR_400.message = errors[0]["message"];
    const errorData = copyObject(CONSTANTS.ERROR.VALIDATION_ERROR_400);
    errorData.errors = errors;
    res.status(errorData.code).send(errorData);
  } else if (errors && errors.hasOwnProperty("code")) {
    const errorData: any = {};
    errorData.message = errors.message;
    errorData.code = errors.code;
    res.status(errors.code).send(errorData);
  } else {
    const errorData = copyObject(CONSTANTS.ERROR.INTERNAL_SERVER_ERROR_500);
    res.status(errorData.code).send(errorData);
  }
};
export const generateRandomString = function (digits: number) {
  return randomstring.generate(digits);
};

/**
 * @description encryptHashPassword encrypt password
 * @param password
 * @param salt
 */
export const encryptHashPassword = async function (password: string, salt) {
  let hashPassword;
  hashPassword = await bcrypt.hash(String(password), salt);
  return hashPassword;
};


/**
 * @description compareValidPassword
 * @param password
 * @param hash
 */
export const compareValidPassword = async (password: string, hash: string) => {
  const correctPassword = await bcrypt.compare(password, hash);
  return correctPassword;
};
