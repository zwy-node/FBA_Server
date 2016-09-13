const co = require('co');

module.exports = co.wrap(function*(ctx, next) {
    yield ctx.blockRender('index');
});

