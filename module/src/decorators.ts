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

export function schema(options?: ISchemaOptions) {
    return function (target: any) {
        Reflect.defineMetadata(RouterModelOptionsSymbol, options, target)
    }
}

export function validate(schema: string | { [index: string]: joi.Schema } | IClass, validation?: joi.Schema | ISchemaOptions, options?: ISchemaOptions): any {


    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (Util.isClass(schema) && Reflect.hasMetadata(RouterModelSymbol, schema)) {

            let opts = Util.getReflectData(RouterModelOptionsSymbol, schema);

            options = _.defaults({}, options, opts);

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

export function param(schema: joi.Schema | IClass | [IClass], append?: joi.Schema): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        if (Util.isClass(schema)) {
            schema = joi.object().keys(Util.getReflectData(RouterModelSymbol, schema))
        }

        if (_.isArray(schema) && Util.isClass(schema[0])) {
            schema = joi.array().items(Util.getReflectData(RouterModelSymbol, schema[0]))
        }

        if (append) {
            schema = schema.concat(append);
        }

        let validations = Util.getReflectData<{ [index: string]: joi.Schema }>(RouterModelSymbol, target.constructor, {});

        validations[propertyKey] = schema;
    }
}
