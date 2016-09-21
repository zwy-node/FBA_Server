/**
 * Created by Fizz on 16/9/19.
 */
'use strict';

var MKODBAction = require('./MKODBAction');

class ConfigInfoAction extends MKODBAction {
    constructor() {
        super();
    }

    *addAddress(address) {
        let dbConnection = yield this.getDBConnection();
        let insertSQL = 'INSERT INTO YSGJ_Address SET ?';
        let addressID = yield this.execSQL(insertSQL, [address], dbConnection);

        let querySQL = 'SELECT b.address, d.`Name` as country, e.`Name` as province, f.`Name` as city FROM YSGJ_Address b INNER JOIN areas d ON b.countryID = d.ID INNER JOIN areas e ON b.provinceID = e.ID INNER JOIN areas f ON b.cityID = f.ID WHERE b.id = ?';
        let addressInfo = yield this.execSQL(querySQL, [addressID.insertId], dbConnection);
        let updateOpt = {};
        updateOpt.fullAddress = addressInfo[0].address + ',' + addressInfo[0].city + ',' + addressInfo[0].province + ',' + addressInfo[0].country;

        let updateSQL = 'UPDATE YSGJ_Address SET ? WHERE `id` = ?';
        yield this.execSQL(updateSQL, [updateOpt, addressID.insertId], dbConnection);

        return addressID.insertId;
    }

    *addFBAWarehouse(data, address) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_FBAWarehouse where `FBAWarehouseID` = ? AND `postcode` = ?';
        let findFBAWarehouse = yield this.execSQL(querySQL, [data.FBAWarehouseID, data.postcode], dbConnection);
        console.log(findFBAWarehouse);
        if(findFBAWarehouse.length > 0) {
            dbConnection.release();
            return findFBAWarehouse;
        } else {
            let insertSQL = 'INSERT INTO YSGJ_FBAWarehouse SET ?';
            let result = yield this.execSQL(insertSQL, data, dbConnection);
            address.name = data.FBAWarehouseID;
            let addressID = yield this.addAddress(address);
            let opt = {addressID: addressID};
            console.log(opt)
            let updateSQL = 'UPDATE YSGJ_FBAWarehouse SET ? WHERE `id` = ?';
            yield this.execSQL(updateSQL, [opt, result.insertId], dbConnection);
            dbConnection.release();
            return result.insertId;
        }
    }


    *FBAWarehouseList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT a.*, b.address, c.`name` as supplierName, d.`Name` as country, e.`Name` as province, f.`Name` as city FROM YSGJ_FBAWarehouse a INNER JOIN YSGJ_Address b ON a.addressID = b.id INNER JOIN YSGJ_Supplier c ON a.supplier = c.id INNER JOIN areas d ON b.countryID = d.ID INNER JOIN areas e ON b.provinceID = e.ID INNER JOIN areas f ON b.cityID = f.ID';
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

    *supplierList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_Supplier';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    };

    //*addressList(param) {
    //    let dbConnection = yield this.getDBConnection();
    //    let querySQL = 'SELECT `ID`, `Name`, `MergerName` FROM areas WHERE ID = ?';
    //    let result = yield this.execSQL(querySQL, [param], dbConnection);
    //    dbConnection.release();
    //    return result;
    //}
}

module.exports = ConfigInfoAction;