import {IModuleOptions} from "appolo";
import    joi = require('joi');


export interface IOptions extends ISchemaOptions, IModuleOptions {

}

export interface ISchemaOptions extends joi.ValidationOptions{

}

export const Defaults: Partial<IOptions> = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
};

