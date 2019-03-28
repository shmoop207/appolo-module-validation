import {Module, module, Util, Hooks} from "appolo/index";
import {IOptions} from "../index";
import * as _ from "lodash";
import {IMetadata, RouterValidationSymbol} from "./src/decorators";
import {validationMiddleware} from "./src/validationMiddleware";
import {Defaults} from "./src/IOptions";

@module()
export class ValidationModule extends Module<IOptions> {


    protected readonly Defaults: Partial<IOptions> = Defaults;

    constructor(opts?: IOptions) {
        super(opts);
    }

    protected beforeInitialize() {

        let opts = _.omit(this.moduleOptions, ["immediate", "parallel"]);

        let controllers = Util.findAllReflectData<IMetadata>(RouterValidationSymbol, this.parent.exported);

        _.forEach(controllers, c => {
            _.forEach(c.metaData, (validations, key) => {
                let route = Util.getRouteDefinition(c.fn, key);

                opts = _.defaults({}, validations.options, opts);

                route.addHook(Hooks.PreMiddleware, validationMiddleware.bind(null, validations.validations, opts))

            })
        })
    }
}
