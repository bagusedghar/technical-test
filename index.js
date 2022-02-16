const app = require('./server/app');
module.exports = app.listen(app.context.config.PORT, () =>
    console.log(`backend ${app.context.config.PORT}`)
);
