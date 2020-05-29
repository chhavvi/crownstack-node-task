import { Users } from "../model";
import * as CONSTANTS from "../constants";
import { Signup, Login } from "../interfaces";
const jwt = require("jsonwebtoken");
import {
  generateRandomString,
  encryptHashPassword,
  compareValidPassword,
} from "../utils/UniversalFunc";
export class UserClass {
  /**
   * registering a user in system
   * @param params
   */
  async signUpUser(params) {
    try {
      //check email already exist in system
      let checkEmailExist = await this.isEmailExists(params);
      //if not exist then create one record
      if (!checkEmailExist) {
        //create random token
        const passwordResetToken = await generateRandomString(
          CONSTANTS.APP.RANDOM_STRING_LENGTH
        );
        params.token = passwordResetToken;

        params.password = await encryptHashPassword(
          params.password.trim(),
          CONSTANTS.APP.SALT_ROUND
        );
        // create a new entry for this email in user table
        let userDetail = await this.createUser(params);
      } else {
        //if user email already exist in system
        return Promise.reject({
          message: CONSTANTS.ERROR_MESSAGE.USER_ALREADY_EXIST,
          code: 409,
        });
      }
    } catch (err) {
      console.error("error in function", err);
      throw new Error(err);
    }
  }
  // check email exist
  async isEmailExists(params: any) {
    try {
      //check email exist in db
      const userData = await Users.findOne({
        where: {
          email: params.email.toLowerCase().trim(),
        },
      });
      return JSON.parse(JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  }
  // create user
  async createUser(params: Signup) {
    try {
      //add user in db
      const newUser = await Users.create({
        email: params.email,
        token: params.token,
        password: params.password,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   *@function signInUser
   * @param param
   */
  async signInUser(param: Login) {
    try {
      if (param.email) {
        //check thew email exist in users
        const userData = await Users.findOne({
          where: {
            email: param.email.toLowerCase(),
          },
        });
        if (userData) {
          //if user email id exist in system
          if (userData.status === CONSTANTS.APP.STATUS.ACTIVE) {
            //if user is active
            const verifyPass = await compareValidPassword(
              param.password.trim(),
              userData.password
            );
            if (!verifyPass) {
              //if Password does not match
              return Promise.reject({
                message: CONSTANTS.ERROR_MESSAGE.INVALID_CREDENTIAL,
                code: 402,
              });
            } else {
              const jwtObj = {
                user_id: userData.id,
                email: userData.email,
                status: userData.status,
              };
              let accesstoken = await this.generateUserToken(jwtObj);
              const userRes = {};
              userRes["user_id"] = userData.id;
              userRes["email"] = userData.email;
              userRes["accesstoken"] = accesstoken;

              return userRes;
            }
          } else {
            //if user is inactive
            return Promise.reject({
              code: 400,
              message: CONSTANTS.ERROR_MESSAGE.INACTIVE_USER,
            });
          }
        } else {
          //if wrong email is entered
          return Promise.reject({
            code: 400,
            message: CONSTANTS.ERROR_MESSAGE.INVALID_EMAIL,
          });
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description generate  jwt token
   * @param params
   */
  async generateUserToken(params) {
    try {
      var token = jwt.sign(params, process.env.JWT_DECODE_STRING);
      return token;
    } catch (error) {
      console.log("error in generateUserToken ", error);
      throw error;
    }
  }
}
