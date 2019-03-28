"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const appolo_1 = require("appolo");
const joi = require("joi");
const _ = require("lodash");
exports.RouterModelSymbol = "__RouterModelDefinitions__";
exports.RouterModelOptionsSymbol = "__RouterModelOptions__";
exports.RouterValidationSymbol = "__RouterValidationSymbol__";
function schema(options, append) {
    return function (target) {
        Reflect.defineMetadata(exports.RouterModelOptionsSymbol, { options, append }, target);
    };
}
exports.schema = schema;
function validate(schema, validation, options) {
    return function (target, propertyKey, descriptor) {
        if (appolo_1.Util.isClass(schema) && Reflect.hasMetadata(exports.RouterModelSymbol, schema)) {
            let opts = appolo_1.Util.getReflectData(exports.RouterModelOptionsSymbol, schema) || {};
            options = _.defaults({}, options, opts.options);
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
function createSchema(fn, type) {
    let schemaMap = appolo_1.Util.getReflectData(exports.RouterModelSymbol, fn);
    let schema = type == "object" ? joi.object().keys(schemaMap) : joi.array().items(schemaMap);
    let opts = appolo_1.Util.getReflectData(exports.RouterModelOptionsSymbol, fn) || {};
    if (opts.append) {
        schema = schema.concat(opts.append);
    }
    return schema;
}
function param(schema, append) {
    return function (target, propertyKey, descriptor) {
        if (appolo_1.Util.isClass(schema)) {
            schema = createSchema(schema, "object");
        }
        if (_.isArray(schema) && appolo_1.Util.isClass(schema[0])) {
            schema = createSchema(schema[0], "array");
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