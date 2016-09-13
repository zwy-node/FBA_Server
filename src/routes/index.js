const Router = require('koa-router');
const route = new Router();
const customerController = require(BASEDIR + '/controller/customerController');
const orderController = require(BASEDIR + '/controller/orderController');
const configInfoController = require(BASEDIR + '/controller/configInfoController');
route.redirect('/', '/user/list');
route.get('/user/list', customerController);
route.get('/order/:type', orderController);

module.exports = [route.routes()];