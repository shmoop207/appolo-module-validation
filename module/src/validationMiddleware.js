"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo_1 = require("appolo");
const joi = require("joi");
const _ = require("lodash");
function validationMiddleware(validations, options, req, res, next) {
    let data = _.extend({}, req.params, req.query, req.body);
    joi.validate(data, validations, options, function (e, params) {
        if (e) {
            return next(new appolo_1.BadRequestError(e.toString()));
        }
        req.model = params;
        next();
    });
}
exports.validationMiddleware = validationMiddleware;
//# sourceMappingURL=validationMiddleware.js.map