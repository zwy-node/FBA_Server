/**
 * Created by Fizz on 16/9/19.
 */
'use strict';

var MKODBAction = require('./MKODBAction');

class ConfigInfoAction extends MKODBAction {
    constructor() {
        super();
    }


    /*
     FBA 仓库模块
     */
    *addAddress(address) {
        address.type = 3;
        let dbConnection = yield this.getDBConnection();
        let insertSQL = 'INSERT INTO YSGJ_Address SET ?';
        let addressID = yield this.execSQL(insertSQL, [address], dbConnection);

        let querySQL = 'SELECT b.address, d.`Name` as country, e.`Name` as province, f.`Name` as city FROM YSGJ_Address b INNER JOIN areas d ON b.countryID = d.ID INNER JOIN areas e ON b.provinceID = e.ID INNER JOIN areas f ON b.cityID = f.ID WHERE b.id = ?';
        let addressInfo = yield this.execSQL(querySQL, [addressID.insertId], dbConnection);
        let updateOpt = {};
        updateOpt.fullAddress = addressInfo[0].address + ',' + addressInfo[0].city + ',' + addressInfo[0].province + ',' + addressInfo[0].country;

        let updateSQL = 'UPDATE YSGJ_Address SET ? WHERE `id` = ?';
        yield this.execSQL(updateSQL, [updateOpt, addressID.insertId], dbConnection);
        dbConnection.release();
        return addressID.insertId;
    }

    *addFBAWarehouse(data, address) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_FBAWarehouse where `FBAWarehouseID` = ? AND `postcode` = ?';
        let findFBAWarehouse = yield this.execSQL(querySQL, [data.FBAWarehouseID, data.postcode], dbConnection);
        console.log(findFBAWarehouse);
        if (findFBAWarehouse.length > 0) {
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

    /*
     地址列表模块, 国家列表, 省/州列表, 市列表, 区/镇/县列表
     */
    *countryList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT `ID`, `Name` FROM areas WHERE ParentId = 0;';
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


    /*
     起运地 与 目的地 模块
     */
    *addStartEndAddress(address) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_Address WHERE type = ? AND provinceID = ? AND cityID = ?';
        let startEndAddress = yield this.execSQL(querySQL, [address.type, address.provinceID, address.cityID], dbConnection);
        if (startEndAddress.length > 0) {
            return null;
        } else {
            let insertSQL = 'INSERT INTO YSGJ_Address SET ?';
            let addressID = yield this.execSQL(insertSQL, [address], dbConnection);
            return addressID.insertId;
        }
    }

    *addStartAddress(address) {
        let addressID = yield this.addStartEndAddress(address);
        if (addressID == null) {
            return null;
        }
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT MAX(sort) as value FROM YSGJ_RouteAddress WHERE type = ?';
        let max = yield this.execSQL(querySQL, [address.type], dbConnection);

        let maxValue = max[0].value;
        console.log(maxValue)
        if (maxValue) {
            maxValue = maxValue + 1;
        } else {
            maxValue = 1;
        }
        let opt = {
            addressID: addressID,
            sort: maxValue,
            createDate: new Date()
        };

        let insertSQL = 'INSERT INTO YSGJ_RouteAddress SET ?';
        let result = yield this.execSQL(insertSQL, [opt], dbConnection);
        dbConnection.release();
        return result.insertId;
    }

    *updateStartAddress(id, opt) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_RouteAddress WHERE id = ?';
        let startEndAddress = yield this.execSQL(querySQL, [id], dbConnection);
        let addressInfo = startEndAddress[0];
        if (opt.sort && opt.sort > 0 && addressInfo.sort != opt.sort) {
            let updateSQL = 'UPDATE YSGJ_RouteAddress set sort = ? WHERE `sort` = ? AND type = 1';
            yield this.execSQL(updateSQL, [addressInfo.sort, opt.sort], dbConnection);
            updateSQL = 'UPDATE YSGJ_RouteAddress set sort = ? WHERE `id` = ?';
            yield this.execSQL(updateSQL, [opt.sort, id], dbConnection);
        }

        querySQL = 'SELECT * FROM YSGJ_Address WHERE type = 1 AND provinceID = ? AND cityID = ?';
        let isExist = yield this.execSQL(querySQL, [opt.provinceID, opt.cityID], dbConnection);
        if(isExist.length > 0) {
            return null;
        }

        delete opt.sort;
        let insertSQL = 'UPDATE YSGJ_Address SET ? WHERE `id` = ?';
        let result = yield this.execSQL(insertSQL, [opt, addressInfo.addressID], dbConnection);
        dbConnection.release();
        return result.insertId;
    }

    *startAddressInfo(id) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT a.*, b.provinceID, b.cityID, c.`Name` as province, d.`Name` as city FROM YSGJ_RouteAddress a INNER JOIN YSGJ_Address b ON a.addressID = b.id INNER JOIN areas c ON b.provinceID = c.ID INNER JOIN areas d ON b.cityID = d.ID WHERE a.type = 1 AND a.id = ?';
        let startAddressInfo = yield this.execSQL(querySQL, [id], dbConnection);
        dbConnection.release();
        return startAddressInfo[0];
    }

    *startAddressList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT a.*, c.`Name` as province, d.`Name` as city FROM YSGJ_RouteAddress a INNER JOIN YSGJ_Address b ON a.addressID = b.id INNER JOIN areas c ON b.provinceID = c.ID INNER JOIN areas d ON b.cityID = d.ID WHERE a.type = 1 ORDER BY sort';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    }


    *addEndAddress(address) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_Address WHERE countryID = ?';
        let startEndAddress = yield this.execSQL(querySQL, [address.countryID], dbConnection);
        if (startEndAddress.length > 0) {
            return null;
        } else {
            let insertSQL = 'INSERT INTO YSGJ_Address SET ?';
            let addressID = yield this.execSQL(insertSQL, [address], dbConnection);

            querySQL = 'SELECT MAX(sort) as value FROM YSGJ_RouteAddress WHERE type = ?';
            let max = yield this.execSQL(querySQL, [address.type], dbConnection);
            let maxValue = max[0].value;
            if (maxValue) {
                maxValue = maxValue + 1;
            } else {
                maxValue = 1;
            }

            let opt = {
                addressID: addressID.insertId,
                sort: maxValue,
                createDate: new Date(),
                type: address.type
            };
            insertSQL = 'INSERT INTO YSGJ_RouteAddress SET ?';
            let result = yield this.execSQL(insertSQL, [opt], dbConnection);
            dbConnection.release();
            return result.insertId;
        }
    }

    *updateEndAddress(id, opt) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_RouteAddress WHERE id = ?';
        let startEndAddress = yield this.execSQL(querySQL, [id], dbConnection);
        let addressInfo = startEndAddress[0];
        if (opt.sort && opt.sort > 0 && addressInfo.sort != opt.sort) {
            let updateSQL = 'UPDATE YSGJ_RouteAddress set sort = ? WHERE `sort` = ? AND type = 2';
            yield this.execSQL(updateSQL, [addressInfo.sort, opt.sort], dbConnection);
            updateSQL = 'UPDATE YSGJ_RouteAddress set sort = ? WHERE `id` = ?';
            yield this.execSQL(updateSQL, [opt.sort, id], dbConnection);
        }

        querySQL = 'SELECT * FROM YSGJ_Address WHERE countryID = ? AND type = 2';
        let isExist = yield this.execSQL(querySQL, [opt.countryID], dbConnection);
        if(isExist.length > 0) {
            return null;
        }
        delete opt.sort;
        let insertSQL = 'UPDATE YSGJ_Address SET ? WHERE `id` = ?';
        let result = yield this.execSQL(insertSQL, [opt, addressInfo.addressID], dbConnection);
        dbConnection.release();
        return result.insertId;
    }

    *endAddressInfo(id) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT a.*, b.countryID, c.Name as country FROM YSGJ_RouteAddress a INNER JOIN YSGJ_Address b ON a.addressID = b.id INNER JOIN areas c ON b.countryID = c.ID WHERE a.type = 2 AND a.id = ?';
        let startAddressInfo = yield this.execSQL(querySQL, [id], dbConnection);
        dbConnection.release();
        return startAddressInfo[0];
    }

    *endAddressList(type) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT a.*, b.countryID, c.Name as country FROM YSGJ_RouteAddress a INNER JOIN YSGJ_Address b ON a.addressID = b.id INNER JOIN areas c ON b.countryID = c.ID WHERE a.type = 2 ORDER BY sort;';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    }

    /*
     商家模块
     */
    *addSupplier(supplier) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_Supplier WHERE name = ? AND contact = ?';
        let findSupplier = yield this.execSQL(querySQL, [supplier.name, supplier.contact], dbConnection);
            console.log(findSupplier)
        if (findSupplier.length > 0) {
            return null;
        } else {
            let insertSQL = 'INSERT INTO YSGJ_Supplier SET ?';
            let addressID = yield this.execSQL(insertSQL, [supplier], dbConnection);
            return addressID.insertId;
        }
    }

    *updateSupplier(id, supplier) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_Supplier WHERE name = ? AND contact = ?';
        let findSupplier = yield this.execSQL(querySQL, [supplier.name, supplier.contact], dbConnection);
        if(findSupplier.length > 0) {
            delete supplier.name;
            delete supplier.contact;
        }
        let updateSQL = 'UPDATE YSGJ_Supplier SET ? WHERE `id` = ?';
        let result = yield this.execSQL(updateSQL, [supplier, id], dbConnection);
        dbConnection.release();
        return result;
    }

    *supplierInfo(id) {
        let dbConnection = yield this.getDBConnection();
        let updateSQL = 'SELECT * FROM YSGJ_Supplier WHERE `id` = ?';
        let result = yield this.execSQL(updateSQL, [id], dbConnection);
        dbConnection.release();
        return result[0];
    }

    *supplierList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_Supplier';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    };


    /*
     货品类型
     */
    *addGoodsType(goodsType) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_TypeGoods WHERE logistics = ? AND goodsType = ? AND property = ?';
        let findGoodsType = yield this.execSQL(querySQL, [goodsType.logistics, goodsType.goodsType, goodsType.property], dbConnection);
        console.log(findGoodsType)
        if (findGoodsType.length > 0) {
            return null;
        } else {
            let insertSQL = 'INSERT INTO YSGJ_TypeGoods SET ?';
            let addressID = yield this.execSQL(insertSQL, [goodsType], dbConnection);
            return addressID.insertId;
        }
    }

    *updateGoodsType(id, goodsType) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_TypeGoods WHERE logistics = ? AND goodsType = ? AND property = ?';
        let findGoodsType = yield this.execSQL(querySQL, [goodsType.logistics, goodsType.goodsType, goodsType.property], dbConnection);
        console.log(findGoodsType);
        if (findGoodsType.length > 0) {
            delete goodsType.logistics;
            delete goodsType.goodsType;
            delete goodsType.property;
        }
        let updateSQL = 'UPDATE YSGJ_TypeGoods SET ? WHERE `id` = ?';
        let result = yield this.execSQL(updateSQL, [goodsType, id], dbConnection);
        dbConnection.release();
        return result;
    }

    *goodsTypeInfo(id) {
        let dbConnection = yield this.getDBConnection();
        let updateSQL = 'SELECT * FROM YSGJ_TypeGoods WHERE `id` = ?';
        let result = yield this.execSQL(updateSQL, [id], dbConnection);
        dbConnection.release();
        return result[0];
    }

    *goodsTypeList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_TypeGoods';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    }


    /*
     本地仓库
     */
    *LWAddress(address) {
        address.type = 4;
        let dbConnection = yield this.getDBConnection();
        let insertSQL = 'INSERT INTO YSGJ_Address SET ?';
        let addressID = yield this.execSQL(insertSQL, [address], dbConnection);

        let querySQL = 'SELECT b.address, d.`Name` as country, e.`Name` as province, f.`Name` as city, g.Name as town FROM YSGJ_Address b INNER JOIN areas d ON b.countryID = d.ID INNER JOIN areas e ON b.provinceID = e.ID INNER JOIN areas f ON b.cityID = f.ID INNER JOIN areas g ON b.townID = g.ID WHERE b.id = ?';
        let addressInfo = yield this.execSQL(querySQL, [addressID.insertId], dbConnection);
        let updateOpt = {};
        updateOpt.fullAddress = addressInfo[0].country + ',' + addressInfo[0].province + ',' + addressInfo[0].city + ',' + addressInfo[0].town + ',' + addressInfo[0].address  ;

        let updateSQL = 'UPDATE YSGJ_Address SET ? WHERE `id` = ?';
        yield this.execSQL(updateSQL, [updateOpt, addressID.insertId], dbConnection);
        dbConnection.release();
        return addressID.insertId;
    }


    *addLocalWarehouse(localWarehouse, address) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_LocalWarehouse WHERE `name`= ? AND phone = ? OR supplier = ?';
        let findLocalWarehouse = yield this.execSQL(querySQL, [localWarehouse.name, localWarehouse.phone, localWarehouse.supplier], dbConnection);
        console.log(findLocalWarehouse)
        if (findLocalWarehouse.length > 0) {
            return null;
        } else {
            let addressID = yield this.LWAddress(address);
            localWarehouse.addressID = addressID;
            let insertSQL = 'INSERT INTO YSGJ_TypeGoods SET ?';
            let addressID = yield this.execSQL(insertSQL, [localWarehouse], dbConnection);
            dbConnection.release();
            return addressID.insertId;
        }
    }

    *updateLWAddress(id, address) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT b.address, d.`Name` as country, e.`Name` as province, f.`Name` as city, g.Name as town FROM YSGJ_Address b INNER JOIN areas d ON b.countryID = d.ID INNER JOIN areas e ON b.provinceID = e.ID INNER JOIN areas f ON b.cityID = f.ID INNER JOIN areas g ON b.townID = g.ID WHERE b.id = ?';
        let addressInfo = yield this.execSQL(querySQL, [id], dbConnection);
        address.fullAddress = addressInfo[0].country + ',' + addressInfo[0].province + ',' + addressInfo[0].city + ',' + addressInfo[0].town + ',' + addressInfo[0].address  ;
        let updateSQL = 'UPDATE YSGJ_Address SET ? WHERE `id` = ?';
        yield this.execSQL(updateSQL, [address, id], dbConnection);
        dbConnection.release();
        return addressID.insertId;
    }

    *updateLocalWarehouse(id, localWarehouse, address) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_TypeGoods WHERE `name`= ? AND phone = ? OR supplier = ?';
        let findGoodsType = yield this.execSQL(querySQL, [localWarehouse.name, localWarehouse.phone, localWarehouse.supplier], dbConnection);
            console.log(findGoodsType[0])
        if(findGoodsType[0]) {
            yield this.updateLWAddress(findGoodsType[0].id, address);
        }
        querySQL = 'SELECT * FROM YSGJ_TypeGoods WHERE `name`= ? AND phone = ? OR supplier = ?';
        let findGoodsType = yield this.execSQL(querySQL, [localWarehouse.name, localWarehouse.phone, localWarehouse.supplier], dbConnection);
        console.log(findGoodsType);
        if (findGoodsType.length > 0) {
            if(localWarehouse.name && localWarehouse.phone) {
                delete localWarehouse.name;
                delete localWarehouse.phone;
            } else {
                delete localWarehouse.supplier;
            }
        }
        let updateSQL = 'UPDATE YSGJ_LocalWarehouse SET ? WHERE `id` = ?';
        let result = yield this.execSQL(updateSQL, [localWarehouse, id], dbConnection);
        dbConnection.release();
        return result;
    }


    *localWarehouseInfo(id) {
        let dbConnection = yield this.getDBConnection();
        let updateSQL = 'SELECT a.*, b.fullAddress, c.`name` as supplierName FROM YSGJ_LocalWarehouse a INNER JOIN YSGJ_Address b ON a.addressID = b.id INNER JOIN YSGJ_Supplier c ON a.supplier = c.id WHERE a.id = ?';
        let result = yield this.execSQL(updateSQL, [id], dbConnection);
        dbConnection.release();
        return result[0];
    }

    *localWarehouseList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT a.*, b.fullAddress, c.`name` as supplierName FROM YSGJ_LocalWarehouse a INNER JOIN YSGJ_Address b ON a.addressID = b.id INNER JOIN YSGJ_Supplier c ON a.supplier = c.id;';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    }
}

module.exports = ConfigInfoAction;