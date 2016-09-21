/**
 * Created by Fizz on 16/9/19.
 */
'use strict';

var MKODBAction = require('./MKODBAction');

class ConfigInfoAction extends MKODBAction {
    constructor() {
        super();
    }

    *addFBAWarehouse(data, address) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'INSERT INTO YSGJ_FBAWarehouse SET ?';
        let addressID = yield this.execSQL(querySQL, [address], dbConnection);
        console.log(addressID);


        //querySQL = 'SELECT * FROM YSGJ_FBAWarehouse where `postcode` = ?';
        //let findFBAWarehouse = yield this.execSQL(querySQL, [data.addressID, data.postcode], dbConnection);
        //console.log(findFBAWarehouse);
        //if(findFBAWarehouse.length > 0) {
        //    dbConnection.release();
        //    return findFBAWarehouse;
        //} else {
        //    let insertSQL = 'INSERT INTO YSGJ_FBAWarehouse SET ?';
        //    let result = yield this.execSQL(insertSQL, data, dbConnection);
        //    dbConnection.release();
        //    return result.insertId;
        //}
    }

    *FBAWarehouseList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT a.*, b.address, c.`name`, d.`Name` as country, e.`Name` as province FROM YSGJ_FBAWarehouse a INNER JOIN YSGJ_Address b ON a.addressID = b.id INNER JOIN YSGJ_Supplier c ON a.supplier = c.id INNER JOIN areas d ON b.provinceID = d.ID INNER JOIN areas e ON b.provinceID = e.ID; ';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    }

    *countryList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT `ID`, `Name` FROM areas WHERE ParentId = ?;';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return result;
    }

    *provinceList(countryID) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT `ID`, `Name` FROM areas WHERE ParentId = ?';
        let result = yield this.execSQL(querySQL, [countryID], dbConnection);
        dbConnection.release();
        return result;
    }

    *cityList(provinceID) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT `ID`, `Name` FROM areas WHERE ParentId = ?;';
        let result = yield this.execSQL(querySQL, [provinceID], dbConnection);
        dbConnection.release();
        return result;
    }

    *townList(cityID) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT `ID`, `Name` FROM areas WHERE ParentId = ?;';
        let result = yield this.execSQL(querySQL, [cityID], dbConnection);
        dbConnection.release();
        return result;
    }
}

module.exports = ConfigInfoAction;