require("module-alias/register");
const Koa = require("koa");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const koaBodyParser = require("koa-bodyparser");
const formidable = require("koa2-formidable");
const { config } = require("@src/config");
const logger = require('@src/utils/logger.utils');

// init KoaJs
const app = new Koa();
app.context.config = config;

// middleware
const transformMiddleware = require("@src/middleware/transform.middleware");
const responseTimeMiddleware = require("@src/middleware/response-time.middleware");
const accessValidMiddleware = require("@src/middleware/access-valid.middleware");

let corsOptions;
if (config.env === "production") {
  corsOptions = {
    origin(ctx) {
      logger.info(`------ctx.origin ${ctx.origin}`);
      logger.info(`------ctx.host ${ctx.host}`);
      logger.info(`------ctx.originalUrl ${ctx.originalUrl}`);
      logger.info(
        `------ctx.request.headers.origin ${ctx.request.headers.origin}`
      );
      if (!["http://localhost:8080"].includes(ctx.request.headers.origin)) {
        return false;
      }
      return "*";
    },
    allowMethods: "GET,PUT,POST,DELETE,PATCH",
  };
} else {
  corsOptions = {
    origin(ctx) {
      logger.info(`------ctx.origin ${ctx.origin}`);
      logger.info(`------ctx.host ${ctx.host}`);
      logger.info(`------ctx.originalUrl ${ctx.originalUrl}`);
      logger.info(
        `------ctx.request.headers.origin ${ctx.request.headers.origin}`
      );
      if (!["http://localhost:8080"].includes(ctx.request.headers.origin)) {
        return false;
      }
      return "*";
    },
    allowMethods: "GET,PUT,POST,DELETE,PATCH",
  };
}

// apply middleware
app.use(cors(corsOptions));
app.use(
  formidable({
    maxFileSize: 50 * 1024 * 1024, // 10mbs
  })
);
app.use(
  koaBodyParser({
    extendTypes: {
      json: ["multipart/form-data"],
    },
  })
);
app.use(helmet());
app.use(transformMiddleware());
app.use(responseTimeMiddleware());
app.use(accessValidMiddleware());

const applyRouter = require("@src/api");

applyRouter(app);

module.exports = app;
