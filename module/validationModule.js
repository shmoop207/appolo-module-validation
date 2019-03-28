"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("appolo/index");
const _ = require("lodash");
const decorators_1 = require("./src/decorators");
const validationMiddleware_1 = require("./src/validationMiddleware");
const IOptions_1 = require("./src/IOptions");
let ValidationModule = class ValidationModule extends index_1.Module {
    constructor(opts) {
        super(opts);
        this.Defaults = IOptions_1.Defaults;
    }
    beforeInitialize() {
        let opts = _.omit(this.moduleOptions, ["immediate", "parallel"]);
        let controllers = index_1.Util.findAllReflectData(decorators_1.RouterValidationSymbol, this.parent.exported);
        _.forEach(controllers, c => {
            _.forEach(c.metaData, (validations, key) => {
                let route = index_1.Util.getRouteDefinition(c.fn, key);
                opts = _.defaults({}, validations.options, opts);
                route.addHook(index_1.Hooks.PreMiddleware, validationMiddleware_1.validationMiddleware.bind(null, validations.validations, opts));
            });
        });
    }
};
ValidationModule = tslib_1.__decorate([
    index_1.module()
], ValidationModule);
exports.ValidationModule = ValidationModule;
//# sourceMappingURL=validationModule.js.map