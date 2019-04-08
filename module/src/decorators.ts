import "reflect-metadata";
import {IRequest, IResponse, Util, IClass} from 'appolo';
import * as joi from "joi";
import * as _ from "lodash";
import {ISchemaOptions} from "./IOptions";

export const RouterModelSymbol = "__RouterModelDefinitions__";
export const RouterModelOptionsSymbol = "__RouterModelOptions__";
export const RouterValidationSymbol = "__RouterValidationSymbol__";

export interface IMetadata {
    [index: string]: { options: ISchemaOptions, validations: { [index: string]: joi.Schema } }
}

interface ISchemaParams {
    options?: ISchemaOptions,
    append?: joi.Schema
}

export function schema(options?: ISchemaOptions, append?: joi.Schema) {
    return function (target: any) {
        Reflect.defineMetadata(RouterModelOptionsSymbol, {options, append}, target)
    }
}

export function validate(schema: string | { [index: string]: joi.Schema } | IClass, validation?: joi.Schema | ISchemaOptions, options?: ISchemaOptions): any {


    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (Util.isClass(schema) && Reflect.hasMetadata(RouterModelSymbol, schema)) {

            let opts = Util.getReflectData<ISchemaParams>(RouterModelOptionsSymbol, schema) || {};

            options = _.defaults({}, options, opts.options);

            schema = Util.getReflectData(RouterModelSymbol, schema)
        }

        if (_.isPlainObject(validation)) {
            options = validation as ISchemaOptions;
        }

        let validationRoute = Util.getReflectData<IMetadata>(RouterValidationSymbol, target.constructor, {});

        if (!validationRoute[propertyKey]) {
            validationRoute[propertyKey] = {
                options: options,
                validations: {}

            };
        }

        _.isObject(schema)
            ? _.extend(validationRoute[propertyKey].validations, schema)
            : validationRoute[propertyKey].validations[schema] = validation as joi.Schema

    }
}

function createSchema(fn: IClass, type: "object" | "array") {

    let schemaMap = Util.getReflectData<joi.SchemaMap>(RouterModelSymbol, fn);

    let schema = type == "object" ? joi.object().keys(schemaMap) : joi.array().items(schemaMap);

    let opts = Util.getReflectData<ISchemaParams>(RouterModelOptionsSymbol, fn) || {};

    if (opts.append) {
        schema = schema.concat(opts.append as any);
    }

    return schema;
}

export function param(schema: joi.Schema | joi.Schema[] | IClass | [IClass], append?: joi.Schema): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        if (Util.isClass(schema) && Reflect.hasMetadata(RouterModelSymbol, schema)) {
            schema = createSchema(schema as IClass, "object");
        }

        if (_.isArray(schema) && Util.isClass(schema[0] && Reflect.hasMetadata(RouterModelSymbol, schema))) {

            schema = createSchema(schema[0] as IClass, "array");
        }

        if (append) {
            schema = (schema as joi.Schema).concat(append as any);
        }

        let validations = Util.getReflectData<{ [index: string]: joi.Schema }>(RouterModelSymbol, target.constructor, {});

        validations[propertyKey] = schema as joi.Schema;
    }
}
