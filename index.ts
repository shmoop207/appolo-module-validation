"use strict";
import "./module/src/overrides"
import {ValidationModule} from "./module/validationModule";
import * as joi from 'joi';
import {validate, param,schema} from "./module/src/decorators"
import {IOptions} from "./module/src/IOptions"


export {ValidationModule, validate, param, joi, IOptions}

