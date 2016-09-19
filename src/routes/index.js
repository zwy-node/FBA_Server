const Router = require('koa-router');
const route = new Router();
const co = require('co');
const CustomerController = require('../controller/CustomerController');
const OrderController = require(BASEDIR + '/controller/OrderController');
const ConfigInfoController = require(BASEDIR + '/controller/ConfigInfoController');
const UserController = require(BASEDIR + '/controller/UserController');
const MainController = require(BASEDIR + '/controller/MainController');

route.get('/', MainController);

route.get('/user/:type', UserController);
route.post('/user/:type', UserController);
route.get('/signout', co.wrap(function*(ctx, next){
    ctx.cookies.set('SESSIONID', '');
    ctx.cookies.set('timestamp', '');
    ctx.render('/user/login');
}));

route.get('/customer/:type', CustomerController);
route.post('/customer/:type', CustomerController);

route.get('/order/:type', OrderController);
route.post('/order/:type', OrderController);

route.get('/config/:type', ConfigInfoController);
route.post('/config/:type', ConfigInfoController);

module.exports = [route.routes()];