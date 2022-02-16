const { config } = require('@src/config');

function Controller(services) {
    const { VersionService } = services;
    async function getVersion(ctx) {
        const version = await VersionService.GetVersionFromFile();
        const data = {
            version,
            env: config.env
        };
        ctx.body = data;
    }

    return {
        getVersion
    };
}

module.exports = Controller;
