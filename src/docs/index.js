const { SwaggerAPI } = require('koa-joi-router-docs');

const generator = new SwaggerAPI();

const htmlDocs = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>futuready-athena api docs</title>
</head>
<body>
	<redoc spec-url='./docs/_api.json' lazy-rendering></redoc>
	<script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"></script>
</body>
</html>
`;

function addDocsForRouter(router, prefix) {
	generator.addJoiRouter(router, {
		prefix
	});
	return this;
}

function generateSpec() {
	return generator.generateSpec(
		{
			info: {
				title: 'backend',
				description: 'backend api docs',
				version: '1'
			},
			basePath: '/',
			tags: [
				{
					name: 'api'
				}
			]
		},
		{
			defaultResponses: {
				200: {
					description: 'Success'
				}
			}
		}
	);
}

function getRoutesForSpec(spec) {
	return [
		{
			method: 'get',
			path: '/_api.json',
			handler: async ctx => {
				ctx.body = JSON.stringify(
					Object.assign(spec, {
						host: ctx.request.host,
						basePath: `/${ctx.appContextRoot}`
					}),
					null,
					'  '
				);
			}
		},
		{
			method: 'get',
			path: '/',
			handler: async ctx => {
				ctx.body = htmlDocs;
			}
		}
	];
}

module.exports = {
	addDocsForRouter,
	generateSpec,
	getRoutesForSpec
};
