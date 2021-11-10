const responder = require('./util/responder');
const auth = require('./util/auth');
const controllers = require('../controllers');
const logger = require('../logger');

module.exports.handler = (event, context, callback) => {
  logger.info('userinfo event %s', JSON.stringify(event));
  controllers(responder(callback)).userinfo(auth.getBearerToken(event));
};
