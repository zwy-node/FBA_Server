/**
 * Created by Fizz on 16/9/14.
 */
const co = require('co');
const utils = require('../utils/Utils');
const userAction = require(BASEDIR + '/database/userAction');

module.exports.init = co.wrap(function*(opt){
    const ROLE = 0;
    let passwordMD5 = utils.MD5(`${opt.password}`);
    opt.password = passwordMD5;
    opt.role = ROLE;

    let result =  yield userAction.addUser(opt);
    if(result.length > 0) {
        console.log('FBABackstage account is: ' + result[0].account);
    }
});

