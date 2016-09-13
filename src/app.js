
'use strict';
var NODE_ENV = process.env.NODE_ENV || 'development';
global.DEBUG = NODE_ENV == 'development';
global.BASEDIR = __dirname;

// 错误日志
const winston = require('winston');
var logLevel = DEBUG ? 'silly' : 'warn';
global.logger = new (winston.Logger)({
    level: logLevel,
    transports: [
        new (winston.transports.Console)()
    ]
});

//配置文件
var config = require(BASEDIR + `/config/${NODE_ENV}`);
global.CONFIG = config;

const path = require('path');
const co = require('co');
const Koa = require('koa');
const render = require('koa-ejs');
const convert = require('koa-convert');
const KoaStatic = require('koa-static-plus');
const KoaCompose = require('koa-compose');
const KoaBodyParser = require('koa-bodyparser');
const koaOnerror = require('koa-onerror');
//const KoaSession = require('./services/koa-MKOSession');
//const MKOSessionStore = require('./services/MKOSessionStore');


var routes = require('./routes');
//var MKODBAction = require('./database/MKODBAction');


var app = new Koa();
//post body 解析
app.use(KoaBodyParser());

//错误捕捉
koaOnerror(app);

//监听浏览器的请求方式,路径,和时间
app.use(co.wrap(function *(ctx, next){
    if (ctx.request.method == 'POST'){
        logger.info(`POST Body: ${JSON.stringify(ctx.request.body)}`);
    }
    var start = new Date();
    yield next();
    var ms = new Date() - start;
    logger.info(`${ctx.request.method} ${ctx.request.url} ${ms}ms`);
}));


//静态文件cache
app.use(convert(KoaStatic(path.join(__dirname, './public'), {
    pathPrefix: '/static'
})));

var options = {
    root: path.join(__dirname, '../views'),
    layout: 'index',
    viewExt: 'html',
    cache: !DEBUG,
    debug: DEBUG
};
render(app, options);
app.context.blockRender = co.wrap(app.context.render);
app.context.render = null;

render(app, options);
app.context.render = co.wrap(app.context.render);

//var redisStore = require('koa-redis')(config.redis);
//app.redis = redisStore.client;
//
////session中间件
//var session = require('koa-generic-session');
//
//    var sessionConfig = {
//    store: redisStore,
//    prefix: 'FBA_Server:sess:',
//    key: 'FBA_Server.sid'
//    };

//app.use(session(sessionConfig));

////数据校验
//var validator = require('koa-validator');
//app.use(validator());


//路由
//var routes = require('koa-routes');
//app.use(routes(app));
app.use(KoaCompose(routes));

//应用路由
//var appRouter = require('./routes/index');
//appRouter(app);

const port = parseInt(config.port || '3000');

app.listen(port, function(err){
    if (err){
        logger.info('Start Server Error: %s', err);
        exit(0);
    }
    logger.info('Server Started! listen port: %s', config.port)
});

