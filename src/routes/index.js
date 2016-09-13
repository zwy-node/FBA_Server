const Router = require('koa-router');
const route = new Router();

const User = require(BASEDIR + '/controller');

route.get('/', User);
module.exports = [route.routes()];