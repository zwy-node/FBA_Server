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
            {key: 'provinceID', type: 'number'},
            {key: 'cityID', type: 'number'},
            {key: 'address'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        addressInfo.type = 2;
        addressInfo.createDate = new Date();
        console.log(FBAWarehouseInfo)
        console.log(addressInfo)
        yield configInfoAction.addFBAWarehouse(FBAWarehouseInfo, addressInfo);
        ctx.response.redirect('/config/fba');
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

var doStartAddress = function*(ctx, next) {
    if (ctx.query.action == 'addStartAddress') {
        let postData = ctx.request.body;
        let rulesAddress = [
            {key: 'provinceID', type: 'number'},
            {key: 'cityID', type: 'number'},
            {key: 'type', type: 'number'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        //addressInfo.type = 1;
        addressInfo.createDate = new Date();
        yield configInfoAction.addStartAddress(addressInfo);
        ctx.response.redirect('/config/originatingAddress');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rulesAddress = [
            {key: 'id', type: 'number'},
            {key: 'provinceID', type: 'number'},
            {key: 'cityID', type: 'number'},
            {key: 'sort', type: 'number'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        let id = addressInfo.id;
        delete addressInfo.id;
        console.log(addressInfo)
        yield configInfoAction.updateStartAddress(id, addressInfo);
        ctx.response.redirect('/config/originatingAddress');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.startAddressInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'startAddress not exist!')
        }
    } else {
        let type = ctx.query.type;
        let result = yield configInfoAction.startAddressList(type);
        for (let item of result.datas) {
            item.createDate = item.createDate.format('yyyy-MM-dd');
        }
        console.log(result)
        yield ctx.render('configInfo/originatingAddress', {data: result});
    }
};

var doEndAddress = function*(ctx, next) {
    if (ctx.query.action == 'addStartAddress') {
        let postData = ctx.request.body;
        let rulesAddress = [
            {key: 'countryID', type: 'number'},
            {key: 'type', type: 'number'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        addressInfo.createDate = new Date();
        yield configInfoAction.addEndAddress(addressInfo);
        ctx.response.redirect('/config/originatingAddress');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rulesAddress = [
            {key: 'id', type: 'number'},
            {key: 'countryID', type: 'number'},
            {key: 'sort', type: 'number'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        let id = addressInfo.id;
        delete addressInfo.id;
        console.log(addressInfo)
        yield configInfoAction.updateEndAddress(id, addressInfo);
        ctx.response.redirect('/config/originatingAddress');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.EndAddressInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'EndAddressInfo not exist!')
        }
    } else {
        let type = ctx.query.type;
        let result = yield configInfoAction.endAddressList(type);
        for (let item of result.datas) {
            item.createDate = item.createDate.format('yyyy-MM-dd');
        }
        console.log(result)
        yield ctx.render('configInfo/destinationAddress', {data: result});
    }
};

var doSupplier = function*(ctx, next) {
    if (ctx.query.action == 'addSupplier') {
        let postData = ctx.request.body;
        let rulesAddress = [
            {key: 'provinceID', type: 'number'},
            {key: 'cityID', type: 'number'},
            {key: 'type', type: 'number'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        //addressInfo.type = 1;
        addressInfo.createDate = new Date();
        yield configInfoAction.addStartAddress(addressInfo);
        ctx.response.redirect('/config/startAddress');
    } else if (ctx.query.action == 'update') {

    } else if (ctx.query.action == 'info') {

    } else if (ctx.query.action == 'list') {
        try {
            let result = yield configInfoAction.supplierList();
            ctx.body = Utils.createResponse(resCode.RES_Success, null, result);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'country not found!');
        }
    } else {
        let result = yield configInfoAction.supplierList();
        yield ctx.render('configInfo/supplier', {data: result});
    }
};

var doAddress = function*(ctx, next) {
    if (ctx.query.action == 'country') {
        try {
            let countryData = yield configInfoAction.countryList();
            ctx.body = Utils.createResponse(resCode.RES_Success, null, countryData);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'country not found!');
        }
    } else if (ctx.query.action == 'province') {
        try {
            let countryID = ctx.query.countryID || 100000;
            let provinceData = yield configInfoAction.provinceList(countryID);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, provinceData);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'country not found!');
        }
    } else if (ctx.query.action == 'city') {
        try {
            let provinceID = ctx.query.provinceID;
            let cityData = yield configInfoAction.cityList(provinceID);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, cityData);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'city not found!');
        }
    } else if (ctx.query.action == 'town') {
        try {
            let cityID = ctx.query.cityID;
            let townData = yield configInfoAction.townList(cityID);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, townData);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'town not found!');
        }
    } else {
        //try {
        //    let param = ctx.query.param;
        //    let addressData = yield configInfoAction.addressList(param);
        //    console.log(addressData)
        //    if(addressData) {
        //        ctx.body = Utils.createResponse(resCode.RES_Success, null, addressData);
        //    } else {
        //        ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'address not found!');
        //    }
        //} catch(e) {
        //    ctx.body = Utils.createResponse(resCode.RES_BusinessError, e);
        //}

        // yield ctx.render('configInfo/localWarehouse', {});
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
        yield doEndAddress(ctx, next);
    } else if (ctx.params.type == 'goodsType') {
        yield doGoodsType(ctx, next);
    } else if (ctx.params.type == 'localCosts') {
        yield doLocalCosts(ctx, next);
    } else if (ctx.params.type == 'localWarehouse') {
        yield doLocalWarehouse(ctx, next);
    } else if (ctx.params.type == 'originatingAddress') {
        yield doStartAddress(ctx, next);
    } else if (ctx.params.type == 'supplier') {
        yield doSupplier(ctx, next);
    } else if (ctx.params.type == 'address') {
        yield doAddress(ctx, next);
    }
    yield next();
});