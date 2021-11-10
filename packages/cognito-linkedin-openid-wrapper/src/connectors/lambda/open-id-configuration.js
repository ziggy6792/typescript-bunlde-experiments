/* eslint-disable no-console */
const responder = require('./util/responder');
const auth = require('./util/auth');
const controllers = require('../controllers');

module.exports.handler = (event, context, callback) => {
  controllers(responder(callback)).openIdConfiguration(
    auth.getIssuer(
      event.headers.Host || event.headers.host,
      event.requestContext && event.requestContext.stage
    )
  );
};
