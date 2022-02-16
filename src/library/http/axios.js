const axios = require('axios');
const logger = require('@src/utils/logger.utils');

function enableInterceptor($axios) {
	// Add a request interceptor
	$axios.interceptors.request.use(
		request => {
			// Do something before request is sent
			logger.info('axios request', request);
			return request;
		},
		error => {
			logger.error('axios request error ', error);
			// Do something with request error
			return Promise.reject(error);
		}
	);

	// Add a response interceptor
	$axios.interceptors.response.use(
		response => {
			// Any status code that lie within the range of 2xx cause this function to trigger
			// Do something with response data
			logger.info('axios response', response);
			return response;
		},
		error => {
			logger.error('axios response error ', error);
			// Any status codes that falls outside the range of 2xx cause this function to trigger
			// Do something with response error
			return Promise.reject(error);
		}
	);
}

enableInterceptor(axios);

module.exports.axios = axios;

module.exports.get = async (url, httpConfig) => {
	return axios
		.get(url, httpConfig)
		.then(response => response)
		.catch(error => error);
};

module.exports.post = async (url, data, httpConfig) => {
	return axios
		.post(url, data, httpConfig)
		.then(response => response)
		.catch(error => error);
};

module.exports.put = async (url, data, httpConfig) => {
	return axios
		.put(url, data, httpConfig)
		.then(response => response)
		.catch(error => error);
};
