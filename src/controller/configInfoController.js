const Utils = require(BASEDIR + '/utils/utils');
const resCode = require(BASEDIR + '/utils/utils').resCode;
const co = require('co');
const ConfigInfoAction = require('../database/ConfigInfoAction');
const configInfoAction = new ConfigInfoAction();

var doFBAWarehouse = function*(ctx, next) {
    if (ctx.query.action == 'addFBAWarehouse') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'FBAWarehouseID'},
            {key: 'postcode', type: 'number'},
            {key: 'supplier', type: 'number'}
        ];
        let FBAWarehouseInfo = Utils.verifyAndFillObject(postData, rules);
        FBAWarehouseInfo.status = 1;
        FBAWarehouseInfo.createDate = new Date();
        FBAWarehouseInfo.modifiedTime = new Date();

        let rulesAddress = [
            {key: 'countryID', type: 'number'},
            {key: 'addressID', type: 'number'},
            {key: 'provinceID', type: 'number'},
            {key: 'cityID', type: 'number'},
            {key: 'townID', type: 'number'},
            {key: 'street'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);


        console.log(FBAWarehouseInfo)
        yield configInfoAction.addFBAWarehouse(FBAWarehouseInfo, addressInfo);
        ctx.response.redirect('configInfo/fba');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'addressID', type: 'number'},
            {key: 'postcode', type: 'number'},
            {key: 'supplier', type: 'number'}
        ];
        let FBAWarehouse = Utils.verifyAndFillObject(postData, rules);

    } else if (ctx.query.action == 'update') {

    } else {
        let result = yield configInfoAction.FBAWarehouseList();
        console.log(result);
        yield ctx.render('configInfo/fba', {data: result});
    }
};

var doDriverCost = function*(ctx, next) {
    if (ctx.query.action == 'addDriverCost') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/driverCosts', {});
    }
};

var doAirTransport = function*(ctx, next) {
    if (ctx.query.action == 'addAirTransport') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/airTransport', {});
    }
};

var doExpress = function*(ctx, next) {
    if (ctx.query.action == 'addExpress') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/express', {});
    }
};


var doDriver = function*(ctx, next) {
    if (ctx.query.action == 'addDriver') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/driver', {});
    }
};

var doDestinationAddress = function*(ctx, next) {
    if (ctx.query.action == 'addDestinationAddress') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/destinationAddress', {});
    }
};

var doGoodsType = function*(ctx, next) {
    if (ctx.query.action == 'addGoodsType') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/goodsType', {});
    }
};

var doLocalCosts = function*(ctx, next) {
    if (ctx.query.action == 'addLocalCosts') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/localCosts', {});
    }
};

var doLocalWarehouse = function*(ctx, next) {
    if (ctx.query.action == 'addLocalCosts') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/localWarehouse', {});
    }
};

var doOriginatingAddress = function*(ctx, next) {
    if (ctx.query.action == 'addOriginatingAddress') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/originatingAddress', {});
    }
};

var doSupplier = function*(ctx, next) {
    if (ctx.query.action == 'addSupplier') {

    } else if (ctx.query.action == 'update') {

    } else {
        yield ctx.render('configInfo/supplier', {});
    }
};

var doAddress = function*(ctx, next) {
    if (ctx.query.action == 'country') {
        try {
            let countryData = yield configInfoAction.countryList();
            if(countryData) {
                ctx.body = Utils.createResponse(resCode.RES_Success, null, countryData);
            } else {
                ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'country not found!');
            }
        } catch(e) {
            ctx.body = Utils.createResponse(resCode.RES_BusinessError, e);
        }
    } else if (ctx.query.action == 'province') {
        try {
            let countryID = ctx.query.countryID;
            let provinceData = yield configInfoAction.provinceList(countryID);
            if(provinceData) {
                ctx.body = Utils.createResponse(resCode.RES_Success, null, provinceData);
            } else {
                ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'country not found!');
            }
        } catch(e) {
            ctx.body = Utils.createResponse(resCode.RES_BusinessError, e);
        }
    } else if (ctx.query.action == 'city') {
        try {
            let provinceID = ctx.query.provinceID;
            let cityData = yield configInfoAction.cityList(provinceID);
            if(cityData) {
                ctx.body = Utils.createResponse(resCode.RES_Success, null, cityData);
            } else {
                ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'country not found!');
            }
        } catch(e) {
            ctx.body = Utils.createResponse(resCode.RES_BusinessError, e);
        }
    } else if (ctx.query.action == 'town') {
        try {
            let cityID = ctx.query.cityID;
            let townData = yield configInfoAction.townList(cityID);
            if(townData) {
                ctx.body = Utils.createResponse(resCode.RES_Success, null, townData);
            } else {
                ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'country not found!');
            }
        } catch(e) {
            ctx.body = Utils.createResponse(resCode.RES_BusinessError, e);
        }
    } else {
        yield ctx.render('configInfo/localWarehouse', {});
    }
};

module.exports = co.wrap(function*(ctx, next) {
    if (ctx.params.type == 'fba') {
        yield doFBAWarehouse(ctx, next);
    } else if (ctx.params.type == 'driverCosts') {
        yield doDriverCost(ctx, next);
    } else if (ctx.params.type == 'airTransport') {
        yield doAirTransport(ctx, next);
    } else if (ctx.params.type == 'express') {
        yield doExpress(ctx, next);
    } else if (ctx.params.type == 'driver') {
        yield doDriver(ctx, next);
    } else if (ctx.params.type == 'destinationAddress') {
        yield doDestinationAddress(ctx, next);
    } else if (ctx.params.type == 'goodsType') {
        yield doGoodsType(ctx, next);
    } else if (ctx.params.type == 'localCosts') {
        yield doLocalCosts(ctx, next);
    } else if (ctx.params.type == 'localWarehouse') {
        yield doLocalWarehouse(ctx, next);
    } else if (ctx.params.type == 'originatingAddress') {
        yield doOriginatingAddress(ctx, next);
    } else if (ctx.params.type == 'supplier') {
        yield doSupplier(ctx, next);
    } else if (ctx.params.type == 'address') {
        yield doAddress(ctx, next);
    }
    yield next();
});