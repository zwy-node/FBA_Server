const Router = require('koa-router');
const route = new Router();
const CustomerController = require(BASEDIR + '/controller/customerController');
const OrderController = require(BASEDIR + '/controller/orderController');
const ConfigInfoController = require(BASEDIR + '/controller/configInfoController');


route.redirect('/', '/Customer/list');
route.get('/customer/:type', CustomerController);
route.get('/order/:type', OrderController);

module.exports = [route.routes()];