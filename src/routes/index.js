const Router = require('koa-router');
const route = new Router();
const CustomerController = require('../controller/CustomerController');
const OrderController = require(BASEDIR + '/controller/OrderController');
const ConfigInfoController = require(BASEDIR + '/controller/ConfigInfoController');
const UserController = require(BASEDIR + '/controller/UserController');


//route.redirect('/', '/customer/list');
route.get('/user/:type', UserController);
route.post('/user/:type', UserController);

route.get('/customer/:type', CustomerController);
route.get('/order/:type', OrderController);

module.exports = [route.routes()];