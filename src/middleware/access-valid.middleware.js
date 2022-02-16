const { ErrorHandler, logger } = require('@src/utils');

module.exports = function ctxValidMiddleware() {
    return async (ctx, next) => {
        if (!ctx.request.url.includes('/version') && !ctx.request.url.includes('/favicon.ico')) {
            console.log(ctx.request.url);
            let authorizationToken = ctx.request.header.authorization;

            logger.info(`authorizationToken: ${JSON.stringify(authorizationToken)}`);

            if (!authorizationToken) {
                throw new ErrorHandler(401, 'unauthorized access');
            }
        }

        await next();
    };
};
