import * as express from "express";
import * as UserRoutes from "./v1";
import * as ProductRoutes from "./v1";
import * as CartRoutes from "./v1";
export class Routes {
  private static BASE_PATH = {
    users: "/api/v1",
    products: "/api/v1",
    carts: "/api/v1",
  };

  static async mount(app: express.Express) {
    app.use(Routes.BASE_PATH.users, <express.Application>UserRoutes);
    app.use(Routes.BASE_PATH.products, <express.Application>ProductRoutes);
    app.use(Routes.BASE_PATH.carts, <express.Application>CartRoutes);
  }
}
