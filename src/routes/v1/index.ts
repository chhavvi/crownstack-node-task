import * as express from "express";
import * as UserPublic from "./user.routes";
import * as ProductPublic from "./product.routes";
import * as CartPublic from "./cart.routes";
const router = express.Router();
router.use("/users", <express.Application>UserPublic);
router.use("/products", <express.Application>ProductPublic);
router.use("/cart", <express.Application>CartPublic);

module.exports = router;
