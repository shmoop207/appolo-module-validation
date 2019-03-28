"use strict";
import {Controller, controller, IRequest, IResponse, get} from 'appolo';
import {validate, joi} from "../../../../index";

@controller()
export class ValidationController extends Controller {

    @get("/test/validations/")
    @validate("userName", joi.string().required())
    test(req: IRequest, res: IResponse) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }

    @get("/test/validations2/")
    @validate("userName", joi.string().required(), {
        stripUnknown: {
            arrays: false,
            objects: true
        }
    })
    test2(req: IRequest, res: IResponse) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }

    @get("/test/validations3/")
    @validate("userName", joi.string().required(), {

        allowUnknown: true,
        stripUnknown: false

    })
    test3(req: IRequest, res: IResponse) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }

    @get("/test/validations/auth")
    @validate({
        username: joi.string().alphanum().min(3).max(30).required(),
        password: joi.string().alphanum().min(3).max(30).required()
    })
    validation(req: IRequest, res: IResponse) {
        res.json(req.model)
    }

}



