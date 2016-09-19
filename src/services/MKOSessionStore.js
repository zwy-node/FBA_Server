/**
 * Created by Kevin on 8/9/2016.
 */
'use strict';

const MKORedis = require('../database/MKORedis');

class MKOSessionStore{
    constructor(){
    }

    *get(sid){
        let dataResult = yield (function(cb){
            MKORedis.get(`SESSION:${sid}`, function(err, res){
                if (err){
                    cb(null, {});
                }else {
                    cb(null, JSON.parse(res));
                }
            });
        });
        return dataResult;
    }

    *set(session, opts) {
        let sid = session.sid;
        yield (function(cb){
            MKORedis.set(`SESSION:${sid}`, JSON.stringify(session), cb);
        });
        return sid;
    }

    *destroy(sid){
        MKORedis.del(`SESSION:${sid}`);
    }
}

module.exports = MKOSessionStore;