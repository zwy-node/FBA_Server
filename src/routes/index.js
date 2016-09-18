const Router = require('koa-router');
const route = new Router();
const CustomerController = require(BASEDIR + '/controller/customerController');
const OrderController = require(BASEDIR + '/controller/orderController');
const ConfigInfoController = require(BASEDIR + '/controller/configInfoController');
const MainController = require(BASEDIR + '/controller/mainController');


route.get('/', MainController);
route.get('/customer/:type', CustomerController);
route.get('/order/:type', OrderController);
route.get('/config/:type', ConfigInfoController);

module.exports = [route.routes()];