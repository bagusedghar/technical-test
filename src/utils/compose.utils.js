function compose(...middlewares) {
	const count = middlewares.length;
	if (!count) return () => undefined;

	let index = 0;
	async function next(ctx) {
		if (index >= count) index = 0;
		const middleware = middlewares[index];
		await middleware(ctx, async () => {
			index += 1;
			if (ctx.done) return;
			if (index < count) await next(ctx);
		});
		return ctx.output;
	}

	return async (args, logger) => {
		const ctx = {
			request: { data: { ...args } },
			response: { data: {} },
			done: false,
			logger,
			get input() {
				return this.request.data;
			},
			set input(newValue) {
				this.request.data = newValue;
			},
			get output() {
				return this.response.data;
			},
			set output(newValue) {
				this.response.data = newValue;
			}
		};

		return await next(ctx);
	};
}

module.exports = compose;
