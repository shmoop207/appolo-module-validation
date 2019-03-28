import {IRequest, IResponse, NextFn, BadRequestError} from "appolo";
import    joi = require('joi');
import    _ = require('lodash');
import {IOptions} from "./IOptions";

export function validationMiddleware(validations: { [index: string]: joi.Schema }, options: IOptions, req: IRequest, res: IResponse, next: NextFn) {
    let data = _.extend({}, req.params, req.query, (req as any).body);

    joi.validate(data, validations, options, function (e, params) {

        if (e) {
            return next(new BadRequestError(e.toString()));
        }

        req.model = params;

        next();
    });
}
