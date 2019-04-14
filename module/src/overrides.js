"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const util_1 = require("appolo/lib/util/util");
const decorators_1 = require("./decorators");
function overrideCast() {
    let schemaObject = _.find(require.cache, (value, key) => _.includes(key, "joi/lib/cast.js"));
    let oldSchema = schemaObject.exports.schema;
    schemaObject.exports.schema = function (joi, config) {
        let schema = getSchema(config);
        if (schema) {
            arguments[1] = schema;
        }
        return oldSchema.apply(joi, arguments);
    };
}
function overrideKeys() {
    let joiObject = _.find(require.cache, (value, key) => _.includes(key, "joi/lib/types/object/index.js"));
    let oldKeys = joiObject.exports.keys;
    joiObject.exports.keys = function () {
        let schema = getSchema(arguments[0]);
        if (schema) {
            arguments[0] = schema;
        }
        return oldKeys.apply(joiObject.exports, arguments);
    };
}
function getSchema(fn) {
    if (util_1.Util.isClass(fn) && Reflect.hasMetadata(decorators_1.RouterModelSymbol, fn)) {
        return util_1.Util.getReflectData(decorators_1.RouterModelSymbol, fn);
    }
}
overrideCast();
overrideKeys();
//# sourceMappingURL=overrides.js.map