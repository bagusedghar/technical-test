function Service(options) {
    const { db, model, utils, config } = options;
    const { logger, http, common, ErrorHandler } = utils;

    async function getBooks(query) {
        const httpConfig = {
			timeout: 600000,
			headers: {
			}
		};

		const resp = await http.get(
			`https://www.googleapis.com/books/v1/volumes?q=${query.q}`,
            httpConfig
		);
        
		return resp.data;
	}

    async function getWishlist() {
        const result = await db.find(model.dbName, model.collection.wishlist);
        logger.info(`getWishlist result : ${JSON.stringify(result)}`);
        return result;
    }

    async function createWishlist(data) {
        const result = await db.insert(model.dbName, model.collection.wishlist, data);
        logger.info(`createWishlist result : ${JSON.stringify(result)}`);
        return result;
    }

    async function deleteWishlist(filter) {
        const result = await db.remove(model.dbName, model.collection.wishlist, filter);
        logger.info(`deleteWishlist result : ${JSON.stringify(result)}`);
        return result;
    }

    return {
        getBooks,
        getWishlist,
        createWishlist,
        deleteWishlist
    };
}
module.exports = Service;
