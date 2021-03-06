const CustomerAction = require('../database/CustomerAction');
const customerAction = new CustomerAction();
const Utils = require(BASEDIR + '/utils/Utils');
const resCode = require(BASEDIR + '/utils/Utils').resCode;
const co = require('co');

var doAddCustomer = function*(ctx, next) {
    if (ctx.query.action == 'addCustomer') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'userName'},
            {key: 'email'},
            {key: 'password'},
            {key: 'mobile'},
            //{key: 'status', type: 'number'},    //0:未激活, 1:正常, 2:禁用
            {key: 'salesmanID', type: 'number'},
            {key: 'headURL'}
        ];

        let customerInfo = Utils.verifyAndFillObject(postData, rules);
        customerInfo.createDate = new Date();
        customerInfo.status = 1;
        let result = yield customerAction.addCustomer(customerInfo);
        if (result.length > 0) {
            ctx.body = Utils.createResponse(resCode.RES_UserExist, 'customer exist!');
        } else {
            ctx.response.redirect('/customer/list');
        }
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},
            {key: 'userName'},
            //{key: 'email'},
            //{key: 'password'},
            {key: 'mobile'},
            {key: 'status', type: 'number'},
            {key: 'salesmanID', type: 'number'},
            {key: 'headURL'}
        ];
        let customerInfo = Utils.verifyAndFillObject(postData, rules);
        let id = customerInfo.id;
        delete customerInfo.id;
        yield customerAction.updateCustomer(id, customerInfo);
        ctx.response.redirect('/customer/list');
    } else if (ctx.query.action == 'salesman') {
        try {
            let salesmanList = yield customerAction.salesmanList();
            ctx.body = Utils.createResponse(resCode.RES_Success, salesmanList);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'customer not exist!');
        }
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let customerDetail = yield customerAction.customerDetail(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, customerDetail);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'customer not exist!')
        }
    } else {
        let page = parseInt(ctx.query.page);
        if (Number.isNaN(page) || page < 1){
            page = 1;
        }
        let param = ctx.query.param || '';
        let result = yield customerAction.customerList(param, page);
        for (let item of result.datas) {
            item.createDate = item.createDate.format('yyyy-MM-dd');
        }
        yield ctx.render('customer/customer_list', {data: result, param: param, status: ['未激活', '正常', '禁用']});
    }
};

var doDetail = function*(ctx, next) {
    try {
        let id = ctx.query.id;
        let customerDetail = yield customerAction.customerDetail(id);
        yield ctx.render('customer/customer_detail', {data: customerDetail, status: ['未激活', '正常', '禁用']});
    } catch (e) {
        ctx.render('customer/customer_detail')
    }
};

var doCustomerOrder = function*(ctx, next) {
    let id = ctx.query.id;
    let customerOrder = yield customerAction.customerOrder(id);
    yield ctx.render('customer/customer_order', {data: customerOrder});
};

module.exports = co.wrap(function*(ctx, next) {
    if (ctx.params.type == 'list') {
        yield doAddCustomer(ctx, next);
    } else if (ctx.params.type == 'detail') {
        yield doDetail(ctx, next);
    } else if (ctx.params.type == 'order') {
        yield doCustomerOrder(ctx, next);
    }
    yield next();
});