const co = require('co');

//module.exports = co.wrap(function*(ctx, next) {
//    yield ctx.render('user_list', {});
//});

module.exports = co.wrap(function*(ctx, next){
    if (ctx.params.type == 'list'){
        console.log('asdfasdg')
        yield ctx.render('user_list', {});
    }else if (ctx.params.type == 'info'){
        yield ctx.render('', {});
    }else if (ctx.params.type == 'order'){
        yield ctx.render('configInfo/driver', {});
    }
    yield next();
});