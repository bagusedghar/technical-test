const library = require('@src/library');

module.exports = config => {
	const storage = library.storage.s3(config);

	function upload(params) {
		const storageParams = {
			Bucket: config.s3.config,
			...params
		};
		return storage.upload(storageParams);
	}

	return {
		upload
	};
};
