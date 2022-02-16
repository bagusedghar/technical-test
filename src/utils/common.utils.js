const nacl = require('tweetnacl');
const utils = require('tweetnacl-util');
const jwt = require('jsonwebtoken');

const path = require('path');
const jwkToPem = require('jwk-to-pem');
const lodash = require('lodash');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

const { ErrorHandler, logger } = require('@src/utils');
const { config } = require('@src/config');

const keys = require('@root/keys');
const plutusPubKey = keys.query.findByFileName('plutus_pub.pem').content;
const plutusPrivKey = keys.query.findByFileName('plutus_priv.pem').content;
const jwkCognito = keys.query.findByFileName('test_fib_jwk.json').content;

const appRoot = path.dirname(require.main.filename || process.mainModule.filename);

module.exports.getAppRoot = () => {
	return appRoot;
};

module.exports.generateUUID = () => {
	return uuidv4();
};

module.exports.defaultDateFormat = date => {
	const formattedDate = moment(date).format('YYYY-MM-DD');
	return formattedDate;
};

module.exports.getStartAndEndDateCurrentMonthStr = () => {
	const startOfMonth = moment()
		.startOf('month')
		.format('YYYY-MM-DD');
	const endOfMonth = moment()
		.endOf('month')
		.format('YYYY-MM-DD');
	return { start_date: startOfMonth, end_date: endOfMonth };
};

module.exports.getStartAndEndDatePreviousMonthStr = (offset = 1) => {
	const startOfMonth = moment()
		.subtract(offset, 'months')
		.startOf('month')
		.format('YYYY-MM-DD');
	const endOfMonth = moment()
		.subtract(offset, 'months')
		.endOf('month')
		.format('YYYY-MM-DD');
	return { start_date: startOfMonth, end_date: endOfMonth };
};

module.exports.getStartAndEndWeekDate = date => {
	const start = moment(date).startOf('isoWeek');
	const end = moment(date).endOf('isoWeek');
	return { start_date: start.toDate(), end_date: end.toDate() };
};

module.exports.getCurrentDate = () => {
	const momentDate = moment(new Date());
	return momentDate.toDate();
};

module.exports.getCurrentMomentDateTimeIndonesia = () => {
	const momentDate = moment(new Date()).tz('Asia/Jakarta');
	return momentDate;
	// return momentDate.toDate();
};

module.exports.convertTimezoneToIndonesia = date => {
	if (typeof date === 'object' && date !== null) {
		if (Object.prototype.toString.call(date) === "[object Date]") {
			const clone = moment(date).clone();
			return clone.tz("Asia/Jakarta").format('YYYY-MM-DDTHH:mm:ss');
		}

		logger.error(`${date} is not Date object, aborting conversion`);
		return date;
	}

	logger.error(`${date} is not object, aborting conversion`);
	return date;
}

module.exports.generateAccessToken = data => {
	const token = jwt.sign(data, plutusPrivKey, { algorithm: 'RS256' });
	return token;
};

module.exports.verifyAccessToken = token => {
	return jwt.verify(token, plutusPubKey, (err, decoded) => {
		if (!err) return { status: true, decoded };
		return { status: false };
	});
};

module.exports.verifyCognitoToken = token => {
	// reference
	// https://cognito-idp.{region}.amazonaws.com/{poolId}/.well-known/jwks.json
	// https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_UEnEe2vuN/.well-known/jwks.json
	// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html

	const tokens = token.replace('Bearer ', '').split('.');
	if (tokens.length < 3) return false; // a jwt must contain header, payload, and signature

	const header = JSON.parse(Buffer.from(tokens[0], 'base64').toString('ascii'));
	const jwks = jwkCognito;
	const key = lodash.filter(jwks.keys, { kid: header.kid });
	if (key.length < 1) return false; // kid must exist in aws jwk

	const jwk = key[0];

	const pem = jwkToPem(jwk);
	return jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err, decoded) {
		if (!err) return { isValid: true, decoded, err };
		logger.error(err);
		return { isValid: false, decoded, err };
	});
};

module.exports.generateTokenDateTime = () => {
	const dt = new Date();
	const fullDate = `${dt.getFullYear()}-${`0${dt.getMonth() + 1}`.slice(-2)}-${dt.getDate()} `;
	const fullTime = dt.toLocaleTimeString(`en-US`, { hour12: false });
	return fullDate + fullTime;
};

module.exports.generateInvoiceNumber = () => {
	const dt = new Date();
	const date = String(dt.getDate()).padStart(2, `0`);
	const hour = String(dt.getHours()).padStart(2, `0`);
	const minute = String(dt.getMinutes()).padStart(2, `0`);
	const second = String(dt.getSeconds()).padStart(2, `0`);
	const mssecond = String(dt.getMilliseconds()).padStart(3, `0`);
	const month =
		dt.getMonth() + 1 >= 10 ? String(dt.getMonth() + 1) : String(`0${dt.getMonth() + 1}`);

	return `${dt
		.getFullYear()
		.toString()
		.substr(-2)}${month}${date}${hour}${minute}${second}${mssecond}`;
};

module.exports.encryptData = data => {
	const { encodeBase64, encodeUTF8, decodeUTF8 } = utils;
	const jsonData = JSON.stringify(data);
	// Our nonce must be a 24 bytes Buffer (or Uint8Array)
	const nonce = nacl.randomBytes(24);
	// Our secret key must be a 32 bytes Buffer (or Uint8Array)
	const secretKey = Buffer.from(config.SECRET_KEY, `utf8`);
	// Make sure your data is also a Buffer of Uint8Array
	const secretData = Buffer.from(jsonData, `utf8`);

	const encrypted = nacl.secretbox(secretData, nonce, secretKey);
	// We can now store our encrypted result and our nonce somewhere
	const encryptedDetailCharges = `${encodeBase64(nonce)}:${encodeBase64(encrypted)}`;
	return encryptedDetailCharges;
};

module.exports.decryptData = encryptedData => {
	const { encodeBase64, decodeBase64, decodeUTF8, encodeUTF8 } = utils;

	const data = encryptedData.split(':');
	const nonce = decodeBase64(data[0]);
	const box = decodeBase64(data[1]);
	const secretKey = Buffer.from(config.SECRET_KEY, `utf8`);

	const decrypted = nacl.secretbox.open(box, nonce, secretKey);
	return encodeUTF8(decrypted);
};

module.exports.generatePaymentDateTime = () => {
	const dt = new Date();
	const date = `${dt.getFullYear()}-${`0${dt.getMonth() + 1}`.slice(-2)}-${dt.getDate()} `;
	const time = dt.toLocaleTimeString(`en-US`, { hour12: false });
	const paymentDt = date + time;
	return paymentDt;
};

module.exports.maskingData = data => {
	const dataTemp = data.split('');

	// eslint-disable-next-line no-plusplus
	for (let i = 3; i < dataTemp.length - 3; i++) {
		dataTemp[i] = '*';
	}

	return dataTemp.join('');
};

module.exports.validateEmailFormat = email => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports.generateQuoteAndInvoiceNumber = () => {
	const dt = exports.getCurrentDate();

	const year = String(dt.getFullYear());
	const month = String(dt.getMonth() + 1).padStart(2, `0`);
	const date = String(dt.getDate()).padStart(2, `0`);
	const hour = String(dt.getHours()).padStart(2, `0`);
	const minute = String(dt.getMinutes()).padStart(2, `0`);
	const second = String(dt.getSeconds()).padStart(2, `0`);
	const mssecond = String(dt.getMilliseconds()).padStart(3, `0`);

	// const latestId = await db.sequelize.query(
	// 	'SELECT last_value from insurance_indonesia_quote_id_seq',
	// 	{
	// 		type: db.sequelize.QueryTypes.SELECT
	// 	}
	// );
	// const seq = (parseInt(latestId[0].last_value, 10) || 0) + 1;

	return {
		quoteNumber: `Q-${year}${month}${date}${hour}${minute}${second}${mssecond}`,
		invoiceNumber: `I-${year}${month}${date}${hour}${minute}${second}${mssecond}`
	};
}
