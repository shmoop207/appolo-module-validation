"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_1 = require("appolo");
const index_1 = require("../../../../index");
let ValidationController = class ValidationController extends appolo_1.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model });
    }
    test2(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model });
    }
    test3(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model });
    }
    validation(req, res) {
        res.json(req.model);
    }
};
tslib_1.__decorate([
    appolo_1.get("/test/validations/"),
    index_1.validate("userName", index_1.joi.string().required())
], ValidationController.prototype, "test", null);
tslib_1.__decorate([
    appolo_1.get("/test/validations2/"),
    index_1.validate("userName", index_1.joi.string().required(), {
        stripUnknown: {
            arrays: false,
            objects: true
        }
    })
], ValidationController.prototype, "test2", null);
tslib_1.__decorate([
    appolo_1.get("/test/validations3/"),
    index_1.validate("userName", index_1.joi.string().required(), {
        allowUnknown: true,
        stripUnknown: false
    })
], ValidationController.prototype, "test3", null);
tslib_1.__decorate([
    appolo_1.get("/test/validations/auth"),
    index_1.validate({
        username: index_1.joi.string().alphanum().min(3).max(30).required(),
        password: index_1.joi.string().alphanum().min(3).max(30).required()
    })
], ValidationController.prototype, "validation", null);
ValidationController = tslib_1.__decorate([
    appolo_1.controller()
], ValidationController);
exports.ValidationController = ValidationController;
//# sourceMappingURL=validationController.js.map