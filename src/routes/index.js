const Router = require('koa-router');
const route = new Router();
const co = require('co');
const CustomerController = require('../controller/customerController');
const OrderController = require(BASEDIR + '/controller/orderController');
const ConfigInfoController = require(BASEDIR + '/controller/configInfoController');
const UserController = require(BASEDIR + '/controller/userController');
const MainController = require(BASEDIR + '/controller/mainController');

route.get('/', MainController);

route.get('/user/:type', UserController);
route.post('/user/:type', UserController);
route.get('/signout', co.wrap(function*(ctx, next){
    ctx.cookies.set('SESSIONID', '');
    ctx.cookies.set('timestamp', '');
    ctx.response.redirect('/user/login');
}));

route.get('/customer/:type', CustomerController);
route.post('/customer/:type', CustomerController);

route.get('/order/:type', OrderController);
route.post('/order/:type', OrderController);

route.get('/config/:type', ConfigInfoController);
route.post('/config/:type', ConfigInfoController);

module.exports = [route.routes()];