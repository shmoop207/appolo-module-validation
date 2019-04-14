"use strict";
import {
    controller,
    Controller,
    get,
    IRequest,
    IResponse,
    middleware,
    post,
} from 'appolo';
import {param, joi, validate} from "../../../../index";
import {schema} from "../../../../module/src/decorators";


export class ValidationModel {
    @param(joi.string().required())
    test: string;

    @param(joi.number().required())
    test2: number
}


class Validation2Model extends ValidationModel {
    @param(joi.string().required())
    id: string;
}

@schema({
    allowUnknown: true,
    stripUnknown: false
})
class Validation3Model extends Validation2Model {
}

class ValidationNestedModel {
    @param(joi.string().required())
    test: string;
}

class Validation4Model {

    @param(ValidationNestedModel)
    test2: ValidationNestedModel
}


@controller()
export class ValidationParamController extends Controller {

    @get('/test/validations/param')
    @validate(ValidationModel)
    public validation(req: IRequest, res: IResponse) {

        let model = this.getModel<ValidationModel>();

        res.json({test: model.test, name: this.constructor.name})
    }

    @get('/test/validations/param_object')
    @validate({a: ValidationModel,b:joi.number().required()})
    public validationObject(req: IRequest, res: IResponse) {

        let model = this.getModel<ValidationModel>();

        res.json({model: model, name: this.constructor.name})
    }

    @get('/test/validations/param2')
    @validate(Validation2Model)
    public validation2(req: IRequest, res: IResponse, model: Validation2Model, route) {


        res.json({test: model.test, id: model.id, name: this.constructor.name})
    }

    @post('/test/validations/param2')
    @validate(Validation2Model)
    @middleware((function (req, res, next) {
        req.model.working = "true";
        next()
    }))
    public validation3(req: IRequest, res: IResponse, model: Validation2Model, route) {


        res.json({test: model.test, id: model.id, name: this.constructor.name, working: req.model.working})
    }

    @get('/test/validations4/param2')
    @validate(Validation3Model)
    public validation4(req: IRequest, res: IResponse, model: Validation3Model, route) {
        res.json({model})
    }

    @get('/test/nested')
    @validate(Validation4Model)
    public nested(req: IRequest, res: IResponse, model: Validation4Model, route) {
        res.json({model})
    }


}


