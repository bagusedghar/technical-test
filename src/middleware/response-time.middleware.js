const { logger } = require('@src/utils');

module.exports = function responseTimeMiddleware() {
    return async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('response-time', `${ms}ms`);
        logger.info(`response-time: ${ms}ms`);
    };
};
