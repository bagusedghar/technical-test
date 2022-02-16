const fs = require("fs");
const path = require("path");
const Router = require("koa-joi-router");

const baseName = path.basename(__filename);
const apiContextRoot = path.basename(path.dirname(__filename));

const docs = require("@src/docs");

const appContextRoot = `${apiContextRoot}`;

function applyApiMiddleware(app) {
  app.context.appContextRoot = appContextRoot;

  // API main routes
  const mainRouter = Router();
  mainRouter.prefix(`/${appContextRoot}`);

  // Docs routes
  let swaggerRoutes = [];
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file.indexOf("_") !== 0 && file !== baseName
      );
    })
    .forEach((file) => {
      const subRouter = require(path.join(__dirname, file));
      mainRouter.use(subRouter.middleware());

      // Docs generation
      const swaggerSpec = docs.addDocsForRouter(subRouter).generateSpec();
      swaggerRoutes = [...docs.getRoutesForSpec(swaggerSpec)];
    });

  const docsRouter = Router();
  docsRouter.prefix("/docs");
  docsRouter.route(swaggerRoutes);
  mainRouter.use(docsRouter.middleware());

  app.use(mainRouter.middleware()).use(mainRouter.router.allowedMethods());
}

module.exports = applyApiMiddleware;
