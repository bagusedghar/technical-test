const handlebars = require('handlebars');
const fs = require('fs');

function readFileSync(fileName) {
	// Read a string from another file synchronously
	let content;
	try {
		content = fs.readFileSync(fileName, { encoding: 'utf8' });
	} catch (err) {
		// An error occurred
		console.error(err);
	}
	return content;
}

function compileTemplateContent(template, input) {
	const compiledTemplate = handlebars.compile(template);
	const content = compiledTemplate(input);
	return content;
}

function jsonToQueryString(json) {
	return `?${Object.keys(json)
		.map(function(key) {
			return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
		})
		.join('&')}`;
}

module.exports = {
	jsonToQueryString,
	compileTemplateContent,
	readFileSync
};
