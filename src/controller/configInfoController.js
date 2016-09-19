const Utils = require(BASEDIR + '/utils/utils');
const resCode = require(BASEDIR + '/utils/utils').resCode;
const co = require('co');
const CustomerAction = require('../database/CustomerAction');
const customerAction = new CustomerAction();

var doFBAWarehouse = function*(ctx, next) {
    if (ctx.query.action == 'addFBAWarehouse') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'addressID', type: 'number'},
            {key: 'postcode', type: 'number'},
            {key: 'supplier', type: 'number'}
        ];
        let FBAWarehouse = Utils.verifyAndFillObject(postData, rules);
        FBAWarehouse.status = 1;
        FBAWarehouse.createDate = Date.now();
        FBAWarehouse.modifiedTime = Date.now();
        console.log(FBAWarehouse)
        let result = yield customerAction.addCustomer(FBAWarehouse);
        if (result.length > 0) {
            ctx.body = Utils.createResponse(resCode.RES_RecordExist, 'FBAWarehouse exist!');
        } else {
            ctx.response.redirect('configInfo/fba');
        }
    } else if(ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'addressID', type: 'number'},
            {key: 'postcode', type: 'number'},
            {key: 'supplier', type: 'number'}
        ];
        let FBAWarehouse = Utils.verifyAndFillObject(postData, rules);

    } else if (ctx.query.action == 'update') {

    }
    yield ctx.render('configInfo/fba', {});
};

module.exports = co.wrap(function*(ctx, next){
    if (ctx.params.type == 'fba'){
        yield doFBAWarehouse(ctx, next);
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