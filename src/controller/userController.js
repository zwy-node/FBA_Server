/**
 * Created by Fizz on 16/9/18.
 */

const userAction = require(BASEDIR + '/database/UserAction');
const Utils = require(BASEDIR + '/utils/utils');
const resCode = require(BASEDIR + '/utils/utils').resCode;
const co = require('co');

var doAddUser = function*(ctx, next) {
    let postData = ctx.request.body;
    let rules = [
        {key: 'account'},
        {key: 'name'},
        {key: 'password'},
        {key: 'role', type: 'number'}
    ];
    let userInfo = Utils.verifyAndFillObject(postData, rules);
    let result = yield userAction.addUser(userInfo);
    if (result.length > 0) {
        ctx.body = Utils.createResponse(resCode.RES_UserExist, 'user exist!');
    } else {
        ctx.response.redirect('/user/list');
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
            if (refer){
                ctx.response.redirect(refer);
            }else{
                ctx.response.redirect('/');
            }
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
    }
    yield next();
});


