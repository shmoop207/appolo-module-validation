"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_1 = require("appolo");
const index_1 = require("../../../../index");
const decorators_1 = require("../../../../module/src/decorators");
class ValidationModel {
}
tslib_1.__decorate([
    index_1.param(index_1.joi.string().required())
], ValidationModel.prototype, "test", void 0);
tslib_1.__decorate([
    index_1.param(index_1.joi.number().required())
], ValidationModel.prototype, "test2", void 0);
exports.ValidationModel = ValidationModel;
class Validation2Model extends ValidationModel {
}
tslib_1.__decorate([
    index_1.param(index_1.joi.string().required())
], Validation2Model.prototype, "id", void 0);
let Validation3Model = class Validation3Model extends Validation2Model {
};
Validation3Model = tslib_1.__decorate([
    decorators_1.schema({
        allowUnknown: true,
        stripUnknown: false
    })
], Validation3Model);
class ValidationNestedModel {
}
tslib_1.__decorate([
    index_1.param(index_1.joi.string().required())
], ValidationNestedModel.prototype, "test", void 0);
class Validation4Model {
}
tslib_1.__decorate([
    index_1.param(ValidationNestedModel)
], Validation4Model.prototype, "test2", void 0);
let ValidationParamController = class ValidationParamController extends appolo_1.Controller {
    validation(req, res) {
        let model = this.getModel();
        res.json({ test: model.test, name: this.constructor.name });
    }
    validationObject(req, res) {
        let model = this.getModel();
        res.json({ model: model, name: this.constructor.name });
    }
    validation2(req, res, model, route) {
        res.json({ test: model.test, id: model.id, name: this.constructor.name });
    }
    validation3(req, res, model, route) {
        res.json({ test: model.test, id: model.id, name: this.constructor.name, working: req.model.working });
    }
    validation4(req, res, model, route) {
        res.json({ model });
    }
    nested(req, res, model, route) {
        res.json({ model });
    }
};
tslib_1.__decorate([
    appolo_1.get('/test/validations/param'),
    index_1.validate(ValidationModel)
], ValidationParamController.prototype, "validation", null);
tslib_1.__decorate([
    appolo_1.get('/test/validations/param_object'),
    index_1.validate({ a: ValidationModel, b: index_1.joi.number().required() })
], ValidationParamController.prototype, "validationObject", null);
tslib_1.__decorate([
    appolo_1.get('/test/validations/param2'),
    index_1.validate(Validation2Model)
], ValidationParamController.prototype, "validation2", null);
tslib_1.__decorate([
    appolo_1.post('/test/validations/param2'),
    index_1.validate(Validation2Model),
    appolo_1.middleware((function (req, res, next) {
        req.model.working = "true";
        next();
    }))
], ValidationParamController.prototype, "validation3", null);
tslib_1.__decorate([
    appolo_1.get('/test/validations4/param2'),
    index_1.validate(Validation3Model)
], ValidationParamController.prototype, "validation4", null);
tslib_1.__decorate([
    appolo_1.get('/test/nested'),
    index_1.validate(Validation4Model)
], ValidationParamController.prototype, "nested", null);
ValidationParamController = tslib_1.__decorate([
    appolo_1.controller()
], ValidationParamController);
exports.ValidationParamController = ValidationParamController;
//# sourceMappingURL=validationParamController.js.map