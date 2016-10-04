/**
 * Created by Fizz on 16/9/18.
 */

const userAction = require(BASEDIR + '/database/UserAction');
const Utils = require(BASEDIR + '/utils/utils');
const resCode = require(BASEDIR + '/utils/utils').resCode;
const co = require('co');

var doAddUser = function*(ctx, next) {
    if (ctx.query.action == 'addCustomer') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'account'},
            {key: 'name'},
            {key: 'password'},
            {key: 'role', type: 'number'}
        ];
        let userInfo = Utils.verifyAndFillObject(postData, rules);
        yield userAction.addUser(userInfo);
        ctx.response.redirect('/user/list');
    } else if (ctx.query.action == 'update') {
        let postData = ctx.request.body;
        let rules = [
            {key: 'id', type: 'number'},
            //{key: 'account'},
            {key: 'name'},
            {key: 'password'},
            {key: 'role', type: 'number'}
        ];
        let userInfo = Utils.verifyAndFillObject(postData, rules);
        let id = userInfo.id;
        delete userInfo.id;
        yield userAction.updateUser(id, userInfo);
        ctx.response.redirect('/user/list');
    } else if (ctx.query.action == 'info') {
        try {
            let id = ctx.query.id;
            let userInfo = yield userAction.userInfo(id);
            ctx.body = Utils.createResponse(resCode.RES_Success, null, userInfo);
        } catch (e) {
            ctx.body = Utils.createResponse(resCode.RES_RecordNotFound, 'userInfo not exist!')
        }
    } else if (ctx.query.action == 'remove') {
        let id = ctx.query.id;
        let status = ctx.query.status; //0: 表示删除, 1:表示正常
        let userInfo = Utils.verifyAndFillObject(id, status);
        yield userAction.removeUser(id, userInfo);
        ctx.response.redirect('/user/list');
    } else {
        let result = yield userAction.userList();
        ctx.response.redirect('/user/list', {data: result});
    }
};

var doLogin = function*(ctx, next) {
    let account = ctx.query.account;
    let password = ctx.query.password;

    if (!account && !password) {
        yield ctx.blockRender('login', {data: {bLoginFail: false}});
    } else {
        let userInfo = yield userAction.getRecordByUser(account);
        if (userInfo && userInfo.password == password) {
            let sid = Utils.MD5(`$^${account}^$`);
            ctx.session = {
                account: account,
                sid: sid,
                date: Date.now()
            };
            ctx.cookies.set('timestamp', ctx.session.date);
            let refer = ctx.query.refer;
            if (refer) {
                ctx.response.redirect(refer);
            } else {
                ctx.response.redirect('/');
            }
        } else {
            yield ctx.blockRender('login', {data: {bLoginFail: true}});
        }
    }
};

var doChangPwd = function*(ctx, next) {
    let account = ctx.query.account;
    let password = ctx.query.password;
    let newPassword = ctx.query.newPassword;
    if (!account && !password) {
        yield ctx.blockRender('login', {data: {bLoginFail: false}});
    } else {
        let userInfo = yield userAction.getRecordByUser(account);
        if (userInfo && userInfo.password == password) {
            yield userAction.changPwd(account, newPassword);
            yield ctx.blockRender('login', {data: {bLoginFail: false}});
        } else {
            yield ctx.blockRender('login', {data: {bLoginFail: true}});
        }
    }
};

module.exports = co.wrap(function*(ctx, next) {
    if (ctx.params.type == 'addUser') {
        yield doAddUser(ctx, next);
    } else if (ctx.params.type == 'login') {
        yield doLogin(ctx, next);
    } else if(ctx.params.type == 'changPwd') {
        yield doChangPwd(ctx, next);
    }
    //else if (ctx.params.type == 'list') {
    //    yield ctx.render('user/user_list', {});
    //}
    yield next();
});


