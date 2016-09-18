/**
 * Created by Fizz on 16/9/14.
 */
'use strict';

const crypto = require('crypto');
/* 验证及数据校正规则
 obj    Object      源对象
 rules   Array     校正规则
 @desc
 rule使用方法
 [{key: 'name', type: 'string', cb: function(obj, callback)}, ...]
 */
function verifyAndFillObject(obj, rules) {
    let newObject = {};
    for (let rule of rules) {
        if (rule.key in obj) {
            let type = rule.type || 'string';
            let value = obj[rule.key];
            let newKey = rule.newKey || rule.key;
            if (typeof value === type) {
                if (rule.cb && typeof rule.cb === 'function') {
                    rule.cb(value, function (result) {
                        newObject[newKey] = result;
                    });
                } else {
                    newObject[newKey] = value;
                }
            } else {
                if (type == 'number') {
                    newObject[newKey] = parseInt(value);
                } else {
                    newObject[newKey] = value;
                }
            }
        }
    }
    return newObject;
}

function MD5(value) {
    let md5 = crypto.createHash('md5');
    md5.update(value);
    return md5.digest('hex');
}

function createResponse(code, desc, response) {
    let result = {code: code};
    if (desc != null) {
        result.desc = desc;
    }
    if(response != null) {
        result.response = response;
    }
    return result;
}

var resCode = {
    RES_Success: 0,
    RES_BusinessError: 1,       //具体业务逻辑错误
    RES_UnknownError: 2,        //未知错误
    RES_ParamsLack: 3,          //缺少参数
    RES_MethodNotFound: 4,      //方法未找到
    RES_UserExist: 5,           //用户已经存在
    RES_UserNotFound: 6,        //用户不存在
    RES_PasswordError: 7,       //密码错误
    RES_SessionNotFound: 8,     //会话不存在，目前用于重置密码会话使用
    RES_SessionTimeout: 9,      //会话不存在，目前用于重置密码会话使用
    RES_RecordNotFound: 10,     //找不到记录
    RES_RecordExist: 11,        //记录已经存在
    RES_AuthSessionFail: 12,    //会话验证失败
    RES_AuthSessionExpired: 13, //会话失效，超时
    RES_UpdateFailed: 14,       //更新失败
    RES_NoPermission: 15        //没有权限
};

module.exports = {
    verifyAndFillObject: verifyAndFillObject,
    MD5: MD5,
    createResponse: createResponse,
    resCode: resCode
};