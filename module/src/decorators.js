"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const appolo_1 = require("appolo");
const joi = require("joi");
const _ = require("lodash");
exports.RouterModelSymbol = "__RouterModelDefinitions__";
exports.RouterModelOptionsSymbol = "__RouterModelOptions__";
exports.RouterValidationSymbol = "__RouterValidationSymbol__";
function schema(options) {
    return function (target) {
        Reflect.defineMetadata(exports.RouterModelOptionsSymbol, options, target);
    };
}
exports.schema = schema;
function validate(schema, validation, options) {
    return function (target, propertyKey, descriptor) {
        if (appolo_1.Util.isClass(schema) && Reflect.hasMetadata(exports.RouterModelSymbol, schema)) {
            let opts = appolo_1.Util.getReflectData(exports.RouterModelOptionsSymbol, schema);
            options = _.defaults({}, options, opts);
            schema = appolo_1.Util.getReflectData(exports.RouterModelSymbol, schema);
        }
        if (_.isPlainObject(validation)) {
            options = validation;
        }
        let validationRoute = appolo_1.Util.getReflectData(exports.RouterValidationSymbol, target.constructor, {});
        if (!validationRoute[propertyKey]) {
            validationRoute[propertyKey] = {
                options: options,
                validations: {}
            };
        }
        _.isObject(schema)
            ? _.extend(validationRoute[propertyKey].validations, schema)
            : validationRoute[propertyKey].validations[schema] = validation;
    };
}
exports.validate = validate;
function param(schema, append) {
    return function (target, propertyKey, descriptor) {
        if (appolo_1.Util.isClass(schema)) {
            schema = joi.object().keys(appolo_1.Util.getReflectData(exports.RouterModelSymbol, schema));
        }
        if (_.isArray(schema) && appolo_1.Util.isClass(schema[0])) {
            schema = joi.array().items(appolo_1.Util.getReflectData(exports.RouterModelSymbol, schema[0]));
        }
        if (append) {
            schema = schema.concat(append);
        }
        let validations = appolo_1.Util.getReflectData(exports.RouterModelSymbol, target.constructor, {});
        validations[propertyKey] = schema;
    };
}
exports.param = param;
//# sourceMappingURL=decorators.js.map