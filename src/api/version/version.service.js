const fs = require('fs');
const path = require('path');

let versionStr;
try {
    const file = path.join(path.dirname(require.main.filename), '/version.properties');
    const version = fs.readFileSync(file); // need to be in an async function
    versionStr = version.toString();
} catch (error) {
    const file = path.join('./version.properties');
    const version = fs.readFileSync(file); // need to be in an async function
    versionStr = version.toString();
}

function Service() {
    async function GetVersionFromFile() {
        return versionStr;
    }

    return {
        GetVersionFromFile
    };
}
module.exports = Service;
