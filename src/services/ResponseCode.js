/**
 * Created by Kevin on 26/1/16.
 */

var BBTResponseCode = {
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

module.exports = BBTResponseCode;