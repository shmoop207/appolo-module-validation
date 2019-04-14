import * as _ from "lodash";
import {IClass} from "appolo";
import {Util} from "appolo/lib/util/util";
import * as joi from "joi";
import {AnySchema} from "joi";
import {SchemaMap} from "joi";
import {RouterModelSymbol} from "./decorators";


declare module "joi" {
    interface ObjectSchema extends AnySchema {
        keys(schema?: SchemaMap | IClass): this;
    }
}

function overrideCast() {
    let schemaObject = _.find(require.cache, (value, key) => _.includes(key, "joi/lib/cast.js"));

    let oldSchema = schemaObject.exports.schema;

    schemaObject.exports.schema = function (joi, config) {

        let schema = getSchema(config);

        if (schema) {
            arguments[1] = schema;
        }

        return oldSchema.apply(joi, arguments)
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

        return oldKeys.apply(joiObject.exports, arguments)

    }
}

function getSchema(fn: any) {
    if (Util.isClass(fn) && Reflect.hasMetadata(RouterModelSymbol, fn)) {
        return Util.getReflectData<joi.SchemaMap>(RouterModelSymbol, fn);
    }
}


overrideCast();
overrideKeys();
