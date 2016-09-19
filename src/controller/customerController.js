const CustomerAction = require('../database/CustomerAction');
const customerAction = new CustomerAction();
const Utils = require(BASEDIR + '/utils/utils');
const resCode = require(BASEDIR + '/utils/utils').resCode;
const co = require('co');

var doAddCustomer = function*(ctx, next) {
    if (ctx.query.action == 'addCustomer') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'userName'},
            {key: 'email'},
            {key: 'password'},
            {key: 'mobile'},
            {key: 'status', type: 'number'},    //0:未激活, 1:正常, 2:禁用
            {key: 'salesmanID', type: 'number'},
            {key: 'headURL'}
        ];

        let customerInfo = Utils.verifyAndFillObject(postData, rules);
        customerInfo.createDate = Date.now();
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
    } else if (ctx.query.action == 'find') {

    } else {
        let result = yield customerAction.customerList();
        yield ctx.render('customer/customer_list', {data: result});
    }
};

var doDetail = function*(ctx, next) {
    try {
        let id = ctx.query.id;
        let customerDetail =  yield customerAction.customerDetail(id);

    } catch (e) {
        ctx.body = {code: 1, error: e};
    }
};

module.exports = co.wrap(function*(ctx, next) {
    if (ctx.params.type == 'list') {
        yield doAddCustomer(ctx, next);
    } else if (ctx.params.type == 'detail') {
        yield doDetail(ctx, next);
        yield ctx.render('customer/customer_detail', {});
    } else if (ctx.params.type == 'order') {
        yield ctx.render('customer/customer_order', {});
    }
    yield next();
});