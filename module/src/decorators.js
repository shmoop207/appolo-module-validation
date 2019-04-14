"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const appolo_1 = require("appolo");
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
        if (_.isObject(schema)) {
            _.extend(validationRoute[propertyKey].validations, schema);
        }
        else {
            validationRoute[propertyKey].validations[schema] = validation;
        }
    };
}
exports.validate = validate;
// function createSchema(fn: IClass, type: "object" | "array") {
//
//     let schemaMap = Util.getReflectData<joi.SchemaMap>(RouterModelSymbol, fn);
//
//     let schema = type == "object" ? joi.object().keys(schemaMap) : joi.array().items(schemaMap);
//
//     let opts = Util.getReflectData<ISchemaParams>(RouterModelOptionsSymbol, fn) || {};
//
//     if (opts.append) {
//         schema = schema.concat(opts.append as any);
//     }
//
//     return schema;
// }
// function getSchema(schema: Schema | Schema[] | IClass | [IClass], append?: Schema): Schema {
//     if (Util.isClass(schema) && Reflect.hasMetadata(RouterModelSymbol, schema)) {
//         schema = createSchema(schema as IClass, "object");
//     }
//
//     if (_.isArray(schema) && Util.isClass(schema[0]) && Reflect.hasMetadata(RouterModelSymbol, schema[0])) {
//
//         schema = createSchema(schema[0] as IClass, "array");
//     }
//
//     if (append) {
//         schema = (schema as joi.Schema).concat(append as any);
//     }
//     return schema as Schema;
// }
function param(schema) {
    return function (target, propertyKey, descriptor) {
        // schema = getSchema(schema, append);
        let validations = appolo_1.Util.getReflectData(exports.RouterModelSymbol, target.constructor, {});
        validations[propertyKey] = schema;
    };
}
exports.param = param;
//# sourceMappingURL=decorators.js.map