function Controller(options) {
    const { BookService, utils, config } = options;
    const { logger, ErrorHandler, common } = utils;

    async function getBooks(ctx) {
        const { query } = ctx.request;
        const response = await BookService.getBooks(query);
        ctx.body = response;
    }

    async function getWishlist(ctx) {
        const response = await BookService.getWishlist();
        ctx.body = response;
    }

    async function createWishlist(ctx) {
        const { body } = ctx.request;
        const response = await BookService.createWishlist(body);
        ctx.body = response;
    }

    async function deleteWishlist(ctx) {
        const { params } = ctx.request;
        const response = await BookService.deleteWishlist({ _id: params._id });
        ctx.body = response;
    }

    return {
        getBooks,
        getWishlist,
        createWishlist,
        deleteWishlist
    };
}

module.exports = Controller;
