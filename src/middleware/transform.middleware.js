const { logger } = require('@src/utils');

function transformer() {
    return async (ctx, next) => {
        try {
            await next();
            if (ctx.response.is('json') && ctx.status === 200) {
                ctx.body = {
                    status: true,
                    message: 'success',
                    statusCode: 200,
                    data: ctx.body
                };
            }
        } catch (error) {
            logger.error(error);
            ctx.status = error.statusCode || 500;
            ctx.body = {
                status: false,
                statusCode: ctx.status,
                message: ctx.status === 500 ? 'internal server error' : error.message
            };
        }
    };
}

module.exports = transformer;
