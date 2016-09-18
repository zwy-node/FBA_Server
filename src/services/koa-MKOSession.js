/**
 * Created by Fizz on 16/9/14.
 */
'use strict';

const uid = require("uid-safe");

const Session = function(opts = {}) {
    opts.key = opts.key || "koa:session";
    opts.store = opts.store || new Store();
    opts.sidKey = opts.sidKey || "sid";

    return function*(ctx, next) {
        let id = ctx.cookies.get(opts.key, opts);

        if(!id) {
            ctx.session = {};
        } else {
            ctx.session = yield opts.store.get(id);
            if(typeof ctx.session !== "object" || ctx.session == null) {
                ctx.session = {};
            }
        }

        let old = JSON.stringify(ctx.session);

        yield next();

        // if not changed
        if(old == JSON.stringify(ctx.session)) return;

        // clear old session if exists
        if(id) {
            yield opts.store.destroy(id);
            id = null;
        }

        // set new session
        if(ctx.session && Object.keys(ctx.session).length) {
            let sid = yield opts.store.set(ctx.session, Object.assign({}, opts));
            ctx.cookies.set(opts.key, sid, opts);
        }
    }
}

module.exports = Session;