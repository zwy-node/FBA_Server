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
        let postData = ctx.request.body;
        let rules = [
            {key: 'logistics', type: 'number'}, // 渠道, 1:双清费用 2:快递
            {key: 'goodsType', type: 'number'}, // 品名分类, 1:普货 2: 特殊货物
            {key: 'name'},
            {key: 'property', type: 'number'}, // 属性, 1:带点, 2:不带电, 3:其他
            {key: 'desc'}
        ];
        let goodsType = Utils.verifyAndFillObject(postData, rules);
        goodsType.createDate = new Date();
        goodsType.status = 1;
        console.log(goodsType)
        yield configInfoAction.addGoodsType(goodsType);
        ctx.response.redirect('/config/goodsType');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rulesAddress = [
            {key: 'id', type: 'number'},
            {key: 'logistics', type: 'number'}, // 渠道, 1:双清费用 2:快递
            {key: 'goodsType', type: 'number'}, // 品名分类, 1:普货 2: 特殊货物
            {key: 'name'},
            {key: 'property', type: 'number'}, // 属性, 1:带点, 2:不带电, 3:其他
            {key: 'desc'},
            {key: 'status', type: 'number'}    // 状态, 1:启动, 2:停用
        ];
        let goodsType = Utils.verifyAndFillObject(postData, rulesAddress);
        let id = goodsType.id;
        delete goodsType.id;
        console.log(goodsType)
        yield configInfoAction.updateGoodsType(id, goodsType);
        ctx.response.redirect('/config/goodsType');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.goodsTypeInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'EndAddressInfo not exist!')
        }
    } else {
        let result = yield configInfoAction.goodsTypeList();
        for (let item of result.datas) {
            item.createDate = item.createDate.format('yyyy-MM-dd');
        }
        console.log(result)
        yield ctx.render('configInfo/goodsType', {data: result, status: ['禁用', '启用'], logistics: ['', '双清费用', '快递'], goodsType: ['', '普货', '特殊货物'], property: ['', '带电', '不带电', '其他']});
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
    if (ctx.query.action == 'addLocalWarehouse') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'warehouseID'},
            {key: 'name'},
            {key: 'contact'},
            {key: 'phone'},
            {key: 'supplier', type: 'number'}
        ];
        let LocalWarehouseInfo = Utils.verifyAndFillObject(postData, rules);
        LocalWarehouseInfo.createDate = new Date();
        LocalWarehouseInfo.modifiedTime = new Date();

        let rulesAddress = [
            {key: 'countryID', type: 'number'},
            {key: 'provinceID', type: 'number'},
            {key: 'cityID', type: 'number'},
            {key: 'townID', type: 'number'},
            {key: 'street'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        addressInfo.createDate = new Date();
        console.log(LocalWarehouseInfo)
        console.log(addressInfo)

        yield configInfoAction.addLocalWarehouse(LocalWarehouseInfo, addressInfo);
        ctx.response.redirect('/config/localWarehouse');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},
            {key: 'warehouseID'},
            {key: 'name'},
            {key: 'contact'},
            {key: 'phone'},
            {key: 'supplier', type: 'number'}
        ];
        let localWarehouseInfo = Utils.verifyAndFillObject(postData, rules);
        localWarehouseInfo.modifiedTime = new Date();

        let rulesAddress = [
            {key: 'countryID', type: 'number'},
            {key: 'provinceID', type: 'number'},
            {key: 'cityID', type: 'number'},
            {key: 'townID', type: 'number'},
            {key: 'street'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        let id = localWarehouseInfo.id;
        delete localWarehouseInfo.id;
        yield configInfoAction.updateLocalWarehouse(id, localWarehouseInfo, addressInfo);
        ctx.response.redirect('/config/localWarehouse');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.localWarehouseInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'localWarehouse not exist!')
        }
    } else {
        let result = yield configInfoAction.localWarehouseList();
        for (let item of result.datas) {
            item.createDate = item.createDate.format('yyyy-MM-dd');
        }
        console.log(result)
        yield ctx.render('configInfo/localWarehouse', {data: result});
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
        let result = yield configInfoAction.startAddressList();
        for (let item of result.datas) {
            item.createDate = item.createDate.format('yyyy-MM-dd');
        }
        yield ctx.render('configInfo/originatingAddress', {data: result});
    }
};

var doEndAddress = function*(ctx, next) {
    if (ctx.query.action == 'addEndAddress') {
        let postData = ctx.request.body;
        let rulesAddress = [
            {key: 'countryID', type: 'number'},
            {key: 'type', type: 'number'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        addressInfo.createDate = new Date();
        console.log(addressInfo)
        yield configInfoAction.addEndAddress(addressInfo);
        ctx.response.redirect('/config/destinationAddress');
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
        ctx.response.redirect('/config/destinationAddress');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.endAddressInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'EndAddressInfo not exist!')
        }
    } else {
        let result = yield configInfoAction.endAddressList();
        for (let item of result.datas) {
            item.createDate = item.createDate.format('yyyy-MM-dd');
        }
        yield ctx.render('configInfo/destinationAddress', {data: result});
    }
};

var doSupplier = function*(ctx, next) {
    if (ctx.query.action == 'addSupplier') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'name'},
            {key: 'contact'},
            {key: 'phone'}
        ];
        let supplierInfo = Utils.verifyAndFillObject(postData, rules);
        supplierInfo.createDate = new Date();
        yield configInfoAction.addSupplier(supplierInfo);
        ctx.response.redirect('/config/supplier');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},
            {key: 'name'},
            {key: 'contact'},
            {key: 'phone'}
        ];
        let supplierInfo = Utils.verifyAndFillObject(postData, rules);
        let id = supplierInfo.id;
        delete supplierInfo.id;
        yield configInfoAction.updateSupplier(id, supplierInfo);
        ctx.response.redirect('/config/supplier');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.supplierInfo(id);
            if(startAddress) {
                startAddress.createDate = startAddress.createDate.format('yyyy-MM-dd');
            }
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'EndAddressInfo not exist!')
        }
    } else if (ctx.query.action == 'list') {
        try {
            let result = yield configInfoAction.supplierList();
            ctx.body = Utils.createResponse(resCode.RES_Success, null, result);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'country not found!');
        }
    } else {
        let result = yield configInfoAction.supplierList();
        for (let item of result.datas) {
            item.createDate = item.createDate.format('yyyy-MM-dd');
        }
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