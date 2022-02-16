require(`dotenv`).config();

const env = process.env.NODE_ENV || 'development';

const configs = {
    development: {
        env,
        PORT: 3000,
        mongoDBUri:
            'mongodb+srv://bagusedghar:bagusedghar@cluster0.cjfmn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        googleApiUrl: 'https://www.googleapis.com/'
    },
    production: {
        env,
        PORT: 80,
        mongoDBUri:
            'mongodb+srv://bagusedghar:bagusedghar@cluster0.cjfmn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        googleApiUrl: 'https://www.googleapis.com/'
    }
};

const config = configs[env];

module.exports = config;
