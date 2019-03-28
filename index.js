"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationModule_1 = require("./module/validationModule");
exports.ValidationModule = validationModule_1.ValidationModule;
const joi = require("joi");
exports.joi = joi;
const decorators_1 = require("./module/src/decorators");
exports.validate = decorators_1.validate;
exports.param = decorators_1.param;
//# sourceMappingURL=index.js.map