const library = require('@src/library');

const http = library.http.axios;

module.exports.http = http;

module.exports.axios = http.axios;

module.exports.get = (url, config) => {
	const httpConfig = {
		headers: {
			Authorization: 'Bearer jwtDummy'
		}
	};
	return http.get(url, config || httpConfig);
};

// Default timeout is 10 minutes
module.exports.post = (url, params, config) => {
	const httpConfig = {
		timeout: 600000,
		headers: {
			Authorization: 'Bearer jwtDummy'
		}
	};
	return http.post(url, params, config  || httpConfig);
};

module.exports.put = (url, params, config) => {
	const httpConfig = {
		timeout: 600000,
		headers: {
			Authorization: 'Bearer jwtDummy'
		}
	};
	return http.put(url, params, config || httpConfig);
};
