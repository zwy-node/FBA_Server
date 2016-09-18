const co = require('co');

//module.exports = co.wrap(function*(ctx, next) {
//    yield ctx.render('user_list', {});
//});

module.exports = co.wrap(function*(ctx, next){
    if (ctx.params.type == 'all'){
        yield ctx.render('order/order_All', {});
    }else if (ctx.params.type == 'closed'){
        yield ctx.render('order/order_Closed', {});
    }else if (ctx.params.type == 'completed'){
        yield ctx.render('order/order_Completed', {});
    }else if (ctx.params.type == 'failed'){
        yield ctx.render('order/order_Failed', {});
    }else if (ctx.params.type == 'notpay'){
        yield ctx.render('order/order_NotPay', {});
    }else if (ctx.params.type == 'wait'){
        yield ctx.render('order/order_Wait', {});
    }else if (ctx.params.type == 'detail'){
        yield ctx.render('order/detail', {});
    }else if (ctx.params.type == 'logistics'){
        yield ctx.render('order/logistics', {});
    }
    yield next();
});