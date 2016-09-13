/**
 * Created by Fizz on 16/9/13.
 */
'use strict';

var MKODBAction = require('./MKODBAction');

class UserAction extends MKODBAction {
    *getRecordByUser(data) {
        let dbConnection = yield this.getDBConnection();
        let insertSQL = 'INSERT INTO YSGJ_Users (`headURL`, `userName`, `email`, `password`, `mobile`, `status`, `salesmanID`, `addressID`, `createDate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let resultData = yield this.execSQL(insertSQL, [data], dbConnection);
        if(resultData.length > 0) {
            resultData = resultData[0];
        } else {
            resultData = null;
        }
        dbConnection.release();
        return resultData;
    }
}

const userAction = new UserAction();

module.exports = userAction;

