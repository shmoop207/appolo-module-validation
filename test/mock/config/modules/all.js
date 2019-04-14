"use strict";
const __1 = require("../../../../");
module.exports = async function (app) {
    await app.module(new __1.ValidationModule({ stripUnknown: true, }));
};
//# sourceMappingURL=all.js.map