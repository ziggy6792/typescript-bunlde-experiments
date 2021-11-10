const qs = require('querystring');
const responder = require('./util/responder');
const auth = require('./util/auth');
const controllers = require('../controllers');

const parseBody = event => {
  const contentType =
    event.headers['Content-Type'] || event.headers['content-type'];
  if (event.body) {
    if (contentType.startsWith('application/x-www-form-urlencoded')) {
      if (event.isBase64Encoded) {
        const buff = Buffer.from(event.body, 'base64');
        const text = buff.toString('utf-8');
        return qs.parse(text);
      }
      return qs.parse(event.body);
    }
    if (contentType.startsWith('application/json')) {
      return JSON.parse(event.body);
    }
  }
  return {};
};

module.exports.handler = (event, context, callback) => {
  const body = parseBody(event);
  const query = event.queryStringParameters || {};

  const code = body.code || query.code;
  const state = body.state || query.state;

  controllers(responder(callback)).token(
    code,
    state,
    auth.getIssuer(
      event.headers.Host || event.headers.host,
      event.requestContext && event.requestContext.stage
    )
  );
};
