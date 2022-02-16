const utils = require('@src/utils');
const { config } = require('@src/config');
const db = require('@src/library/db/mongodb');
const model = require('@src/models').bookModel;
const BookService = require('./book.service')({ db, model, utils, config });
const BookController = require('./book.controller')({
    BookService,
    utils,
    config
});

module.exports = require('./book.routes')({ BookController });
module.exports.BookService = BookService;
