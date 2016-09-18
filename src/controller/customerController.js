const co = require('co');

//module.exports = co.wrap(function*(ctx, next) {
//    yield ctx.render('user_list', {});
//});

module.exports = co.wrap(function*(ctx, next){
    if (ctx.params.type == 'list'){
        yield ctx.render('customer/customer_list', {});
    }else if (ctx.params.type == 'detail'){
        yield ctx.render('customer/customer_detail', {});
    }else if (ctx.params.type == 'order'){
        yield ctx.render('customer/customer_order', {});
    }
    yield next();
});