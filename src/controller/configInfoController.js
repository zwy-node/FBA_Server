const co = require('co');

module.exports = co.wrap(function*(ctx, next){
    if (ctx.params.type == 'fba'){
        yield ctx.render('configInfo/fba', {});
    }else if (ctx.params.type == 'driverCosts'){
        yield ctx.render('configInfo/driverCosts', {});
    }else if (ctx.params.type == 'airTransport'){
        yield ctx.render('configInfo/airTransport', {});
    }else if (ctx.params.type == 'express'){
        yield ctx.render('configInfo/express', {});
    }else if (ctx.params.type == 'driver'){
        yield ctx.render('configInfo/driver', {});
    }else if (ctx.params.type == 'destinationAddress'){
        yield ctx.render('configInfo/destinationAddress', {});
    }else if (ctx.params.type == 'goodsType'){
        yield ctx.render('configInfo/goodsType', {});
    }else if (ctx.params.type == 'localCosts'){
        yield ctx.render('configInfo/localCosts', {});
    }else if (ctx.params.type == 'localWarehouse'){
        yield ctx.render('configInfo/localWarehouse', {});
    }else if (ctx.params.type == 'originatingAddress'){
        yield ctx.render('configInfo/originatingAddress', {});
    }else if (ctx.params.type == 'supplier'){
        yield ctx.render('configInfo/supplier', {});
    }
    yield next();
});