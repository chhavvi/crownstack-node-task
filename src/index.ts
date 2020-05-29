import * as express from "express";
import * as bodyParser from "body-parser";
import * as CONFIG from "./config";
import * as compression from "compression";
import { Server } from "http";
import { BootClass } from "../src/utils/Bootstrap";

export class App extends BootClass {
  private static instance: App = null;

  private app: express.Express;
  private server: Server;

  private constructor() {
    super();
    this.app = express();
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  async init() {
    try {
      await this.loadMiddleware();
      await App.Boot();
      const Routes = require("../src/routes").Routes;
      await Routes.mount(this.app);
      await this.start();
    } catch (error) {
      throw error;
    }
  }

  private async loadMiddleware() {
    try {
      // parse application/x-www-form-urlencoded
      this.app.use(bodyParser.urlencoded({ extended: false }));
      // parse application/json
      this.app.use(bodyParser.json({ limit: "10mb" }));
      this.app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Methods",
          "PUT, POST, GET, DELETE, OPTIONS"
        );
        if (req.method === "OPTIONS") {
          res.send(200);
        } else {
          next();
        }
      });
    } catch (error) {
      throw error;
    }
  }

  private async start() {
    this.server = await this.app.listen(CONFIG.APP.PORT, (err, info) => {
      if (err) throw err;
      console.log("Server running at: ", CONFIG.APP.PORT);
    });
  }
}
