const path = require('path');
const Router = require('koa-joi-router');
const swaggerTags = ['api'];
const apiName = path.basename(path.dirname(__filename));

function Routes(Controller) {
    const routes = [
        {
            method: 'GET',
            path: '/',
            meta: {
                swagger: {
                    summary: 'version',
                    description: 'current version of this application',
                    tags: swaggerTags
                }
            },
            handler: async ctx => {
                await Controller.getVersion(ctx);
            }
        }
    ];

    const router = Router();
    router.prefix(`/${apiName}`);
    router.route(routes);

    return router;
}

module.exports = Routes;
