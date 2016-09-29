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
            {key: 'id', type: 'number'},
            {key: 'postcode', type: 'number'},
            {key: 'supplier', type: 'number'}
        ];
        let FBAWarehouse = Utils.verifyAndFillObject(postData, rules);
        FBAWarehouse.modifiedTime = new Date();
        let id = FBAWarehouse.id;
        delete FBAWarehouse.id;

        let rulesAddress = [
            {key: 'addressID', type: 'number'},
            {key: 'countryID', type: 'number'},
            {key: 'provinceID', type: 'number'},
            {key: 'cityID', type: 'number'},
            {key: 'address'}
        ];
        let addressInfo = Utils.verifyAndFillObject(postData, rulesAddress);
        let addressID = addressInfo.addressID;
        delete addressInfo.addressID;

        yield configInfoAction.updateFBAWarehouse(id, FBAWarehouse, addressID, addressInfo);
        ctx.response.redirect('/config/fba');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.FBAWarehouseInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'FBAWarehouse not exist!')
        }
    } else {
        let result = yield configInfoAction.FBAWarehouseList();
        yield ctx.render('configInfo/fba', {data: result});
    }
};

var doAirTransport = function*(ctx, next) {
    if (ctx.query.action == 'addAirTransport') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'startID', type: 'number'},       //起运地ID
            {key: 'endID', type: 'number'},         //目的地ID
            {key: 'zipCodeHead', type: 'number'},   //邮编开头
            {key: 'kindOfGoodsID', type: 'number'}, //货品类型ID
            {
                key: 'prices', type: 'object', cb: function (value, cb) {
                try {
                    let result = JSON.stringify(value);
                    cb(result)
                } catch (e) {
                    console.log(e)
                }
            }
            },        //价格
            {key: 'fastestDay', type: 'number'},    //最快天
            {key: 'slowestDay', type: 'number'},    //最慢天
            {key: 'logistics', type: 'number'},     //1:双清, 2:快递
            {key: 'expires'}                        //过期日期
        ];
        let FBACostInfo = Utils.verifyAndFillObject(postData, rules);
        FBACostInfo.status = 1;
        FBACostInfo.createDate = new Date();
        FBACostInfo.modifiedTime = new Date();
        console.log(FBACostInfo)
        yield configInfoAction.addFBACost(FBACostInfo);
        ctx.response.redirect('/config/fba');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},
            {key: 'startID', type: 'number'},       //起运地ID
            {key: 'endID', type: 'number'},         //目的地ID
            {key: 'zipCodeHead', type: 'number'},   //邮编开头
            {key: 'kindOfGoodsID', type: 'number'}, //货品类型ID
            {
                key: 'prices', type: 'object', cb: function (value, cb) {
                try {
                    let result = JSON.stringify(value);
                    cb(result)
                } catch (e) {
                    console.log(e)
                }
            }
            },        //价格
            {key: 'fastestDay', type: 'number'},    //最快天
            {key: 'slowestDay', type: 'number'},    //最慢天
            {key: 'logistics', type: 'number'},     //1:双清, 2:快递
            {key: 'expires'}                        //过期日期
        ];
        let FBACostInfo = Utils.verifyAndFillObject(postData, rules);
        FBACostInfo.status = 1;
        FBACostInfo.createDate = new Date();
        FBACostInfo.modifiedTime = new Date();
        let id = FBACostInfo.id;
        delete  FBACostInfo.id;
        console.log(FBACostInfo)
        yield configInfoAction.updateFBACost(id, FBACostInfo);
        ctx.response.redirect('/config/fba');
    } else if(ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.FBACostInfo(id);
            //startAddress.expires = startAddress.expires.format('yyyy-MM-dd');
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'goodsType not exist!')
        }
    } else {
        let logistics = ctx.query.logistics || 1;
        let result = yield configInfoAction.FBACostList(logistics);
        //for (let item of result.datas) {
        //    item.expires = item.expires.format('yyyy-MM-dd');
        //}
        if(logistics == 1) {
            console.log(result)
            yield ctx.render('configInfo/airTransport', {data: result,goodsType: ['', '普货', '特殊货物'],});
        } else {
            console.log(result)
            yield ctx.render('configInfo/express', {data: result,goodsType: ['', '普货', '特殊货物'],});
        }
    }
};


var doDriverCost = function*(ctx, next) {
    if (ctx.query.action == 'addDriverCost') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'startAddress', type: 'object'},
            {key: 'endAddress', type: 'object'},
            {key: 'prices', type: 'object', cb: function (value, cb) {
                try {
                    let result = JSON.stringify(value);
                    cb(result)
                } catch (e) {
                    console.log(e)
                }
            }},                 //价格
            {key: 'expires'}    //过期日期
        ];
        let truckCostInfo = Utils.verifyAndFillObject(postData, rules);
        truckCostInfo.status = 1;
        truckCostInfo.createDate = new Date();
        truckCostInfo.modifiedTime = new Date();

        let startAddress = truckCostInfo.startAddress;
        delete truckCostInfo.startAddress;
        let endAddress = truckCostInfo.endAddress;
        delete truckCostInfo.endAddress;

        yield configInfoAction.addDriverCost(truckCostInfo, startAddress, endAddress);
        ctx.response.redirect('/config/driverCosts');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},
            {key: 'addressID', type: 'number'},
            {key: 'destination', type: 'number'},
            {key: 'startAddress', type: 'object'},
            {key: 'endAddress', type: 'object'},
            {key: 'prices', type: 'object', cb: function (value, cb) {
                try {
                    let result = JSON.stringify(value);
                    cb(result)
                } catch (e) {
                    console.log(e)
                }
            }},                 //价格
            {key: 'expires'}    //过期日期
        ];
        let truckCostInfo = Utils.verifyAndFillObject(postData, rules);
        truckCostInfo.modifiedTime = new Date();

        let id = truckCostInfo.id;
        delete truckCostInfo.id;
        let addressID = truckCostInfo.addressID;
        delete truckCostInfo.addressID;
        let destination = truckCostInfo.destination;
        delete truckCostInfo.destination;
        let startAddress = truckCostInfo.startAddress;
        delete truckCostInfo.startAddress;
        let endAddress = truckCostInfo.endAddress;
        delete truckCostInfo.endAddress;

        yield configInfoAction.updateDriverCost(id, truckCostInfo, addressID, startAddress, destination, endAddress);
        ctx.response.redirect('/config/driverCosts');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let driverCostInfo = yield configInfoAction.driverCostInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, driverCostInfo);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'driverCost not exist!')
        }
    } else {
        let result = yield configInfoAction.driverCostList();
        yield ctx.render('configInfo/driverCosts', {data: result});
    }
};

//var doExpress = function*(ctx, next) {
//    if (ctx.query.action == 'addExpress') {
//
//    } else if (ctx.query.action == 'update') {
//
//    } else {
//        yield ctx.render('configInfo/express', {});
//    }
//};


var doDriver = function*(ctx, next) {
    if (ctx.query.action == 'addDriver') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'headImage'},                //司机照片
            {key: 'name'},                     //名称
            {key: 'mobile'},                   //联系电话
            {key: 'idCard'},                   //身份证
            {key: 'idCardImageFront'},         //最快天
            {key: 'idCardImageBack'},          //最慢天
            {key: 'driverIDImage'},            //驾驶证
            {key: 'carID'},                    //车牌
            {key: 'models'},                   //车型
            {key: 'carImage'},                 //车照
            {key: 'carIDImage'}                //车证
        ];
        let driverInfo = Utils.verifyAndFillObject(postData, rules);
        driverInfo.status = 1;
        driverInfo.createDate = new Date();
        driverInfo.modifiedTime = new Date();
        console.log(driverInfo)
        yield configInfoAction.addDriver(driverInfo);
        ctx.response.redirect('/config/driver');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},       //ID
            {key: 'headImage'},                //司机照片
            {key: 'name'},                     //名称
            {key: 'mobile'},                   //联系电话
            {key: 'idCard'},                   //身份证
            {key: 'idCardImageFront'},         //最快天
            {key: 'idCardImageBack'},          //最慢天
            {key: 'driverIDImage'},            //驾驶证
            {key: 'carID'},                    //车牌
            {key: 'models'},                   //车型
            {key: 'carImage'},                 //车照
            {key: 'carIDImage'}                //车证
        ];
        let driverInfo = Utils.verifyAndFillObject(postData, rules);
        let id = driverInfo.id;
        driverInfo.status = 1;
        driverInfo.modifiedTime = new Date();
        delete driverInfo.id;
        console.log(driverInfo)
        yield configInfoAction.updateDriver(id, driverInfo);
        ctx.response.redirect('/config/driver');
    } else if (ctx.query.action == 'remove') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},       //ID
            {key: 'status', type: 'number'}    //0:删除, 1:正常
        ];
        let driverInfo = Utils.verifyAndFillObject(postData, rules);
        let id = driverInfo.id;
        driverInfo.modifiedTime = new Date();
        delete driverInfo.id;
        console.log(driverInfo)
        yield configInfoAction.removeDriver(id, driverInfo);
        ctx.response.redirect('/config/driver');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let startAddress = yield configInfoAction.driverInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'driver not exist!')
        }
    } else if (ctx.query.action == 'list') {
        try {
            let startAddress = yield configInfoAction.driverList();
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'driver not exist!')
        }
    } else {
        let result = yield configInfoAction.driverList();
        //for (let item of result.datas) {
        //    item.createDate = item.createDate.format('yyyy-MM-dd');
        //}
        console.log(result)
        yield ctx.render('configInfo/driver', {data: result});
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
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'goodsType not exist!')
        }
    } else if (ctx.query.action == 'list') {
        try {
            let result = yield configInfoAction.goodsTypeList();
            ctx.body = Utils.createResponse(resCode.RES_Success, null, result);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'goodsType not found!');
        }
    } else {
        let result = yield configInfoAction.goodsTypeList();
        //for (let item of result.datas) {
        //    item.createDate = item.createDate.format('yyyy-MM-dd');
        //}
        console.log(result)
        yield ctx.render('configInfo/goodsType', {
            data: result,
            status: ['禁用', '启用'],
            logistics: ['', '双清费用', '快递'],
            goodsType: ['', '普货', '特殊货物'],
            property: ['', '带电', '不带电', '其他']
        });
    }
};

var doLocalCosts = function*(ctx, next) {
    if (ctx.query.action == 'addLocalCost') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'cname'},                //中文名
            {key: 'ename'},                //名称
            {key: 'unit', type: 'number'}, //单元, 1:BL, 2:KG
            {key: 'currency'},             //币种
            {key: 'price', type: 'number'} //最快天
        ];
        let localCostsInfo = Utils.verifyAndFillObject(postData, rules);
        localCostsInfo.status = 1;
        localCostsInfo.createDate = new Date();
        localCostsInfo.modifiedTime = new Date();
        console.log(localCostsInfo)
        yield configInfoAction.addLocalCost(localCostsInfo);
        ctx.response.redirect('/config/localCosts');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},   //id
            {key: 'cname'},                //中文名
            {key: 'ename'},                //名称
            {key: 'unit', type: 'number'}, //单元, 1:BL, 2:KG
            {key: 'currency'},             //币种
            {key: 'price', type: 'number'} //最快天
        ];
        let localCostsInfo = Utils.verifyAndFillObject(postData, rules);
        let id = localCostsInfo.id;
        localCostsInfo.status = 1;
        localCostsInfo.modifiedTime = new Date();
        delete localCostsInfo.id;
        console.log(localCostsInfo)
        yield configInfoAction.updateLocalCost(id, localCostsInfo);
        ctx.response.redirect('/config/localCosts');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let result = yield configInfoAction.localCostInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, result);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'startAddress not found!');
        }
    } else if (ctx.query.action == 'remove') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},       //ID
            {key: 'status', type: 'number'}    //0:删除, 1:正常
        ];
        let driverInfo = Utils.verifyAndFillObject(postData, rules);
        let id = driverInfo.id;
        driverInfo.modifiedTime = new Date();
        delete driverInfo.id;
        console.log(driverInfo)
        yield configInfoAction.removeLocalCost(id, driverInfo);
        ctx.response.redirect('/config/driver');
    } else if (ctx.query.action == 'list') {
        try {
            let result = yield configInfoAction.localCostList();
            ctx.body = Utils.createResponse(resCode.RES_Success, null, result);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'startAddress not found!');
        }
    } else {
        let result =  yield configInfoAction.localCostList();
        yield ctx.render('configInfo/localCosts', {data: result, status: ['删除','正常','禁用'], unit: ['','BL','KG']});
    }
};

var doLocalWarehouse = function*(ctx, next) {
    if (ctx.query.action == 'addLocalWarehouse') {
        let postData = ctx.request.body;
        let rules = [
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
            let startAddress = yield configInfoAction.driverCostInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, startAddress);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'localWarehouse not exist!')
        }
    } else {
        let result = yield configInfoAction.localWarehouseList();
        //for (let item of result.datas) {
        //    item.createDate = item.createDate.format('yyyy-MM-dd');
        //}
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
    } else if (ctx.query.action == 'list') {
        try {
            let result = yield configInfoAction.startAddressList();
            ctx.body = Utils.createResponse(resCode.RES_Success, null, result);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'startAddress not found!');
        }
    } else {
        let result = yield configInfoAction.startAddressList();
        //for (let item of result.datas) {
        //    item.createDate = item.createDate.format('yyyy-MM-dd');
        //}
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
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'endAddressInfo not exist!')
        }
    } else if (ctx.query.action == 'list') {
        try {
            let result = yield configInfoAction.endAddressList();
            ctx.body = Utils.createResponse(resCode.RES_Success, null, result);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'endAddress not found!');
        }
    } else {
        let result = yield configInfoAction.endAddressList();
        //for (let item of result.datas) {
        //    item.createDate = item.createDate.format('yyyy-MM-dd');
        //}
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
            //if (startAddress) {
            //    startAddress.createDate = startAddress.createDate.format('yyyy-MM-dd');
            //}
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
        //for (let item of result.datas) {
        //    item.createDate = item.createDate.format('yyyy-MM-dd');
        //}
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
    //} else if (ctx.params.type == 'express') {
    //    yield doExpress(ctx, next);
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