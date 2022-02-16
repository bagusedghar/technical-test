const path = require('path');
const Router = require('koa-joi-router');
const swaggerTags = ['api'];
const apiName = path.basename(path.dirname(__filename));

function Routes(options) {
    const { BookController } = options;
    const routes = [
        {
            method: 'GET',
            path: '/',
            meta: {
                swagger: {
                    summary: 'get books with filtering',
                    description: 'get books with filtering',
                    tags: swaggerTags
                }
            },
            handler: async ctx => {
                await BookController.getBooks(ctx);
            }
        },
        {
            method: 'GET',
            path: '/wishlist',
            meta: {
                swagger: {
                    summary: 'get wishlist',
                    description: 'get books',
                    tags: swaggerTags
                }
            },
            handler: async ctx => {
                await BookController.getWishlist(ctx);
            }
        },
        {
            method: 'POST',
            path: '/wishlist',
            meta: {
                swagger: {
                    summary: 'create wishlist',
                    description: 'create wishlist',
                    tags: swaggerTags
                }
            },
            handler: async ctx => {
                await BookController.createWishlist(ctx);
            }
        },
        {
            method: 'DELETE',
            path: '/wishlist/:_id',
            meta: {
                swagger: {
                    summary: 'delete wishlist',
                    description: 'delete wishlist',
                    tags: swaggerTags
                }
            },
            handler: async ctx => {
                await BookController.deleteWishlist(ctx);
            }
        }
    ];

    const router = Router();
    router.prefix(`/${apiName}`);
    router.route(routes);

    return router;
}

module.exports = Routes;
