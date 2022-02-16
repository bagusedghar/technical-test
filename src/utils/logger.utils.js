const opts = {};
opts.level = "info";
opts.prettyPrint = {
  colorize: true,
  translateTime: true,
  ignore: "pid,time,hostname",
};

const logger = require("pino")(opts);

module.exports = logger;
