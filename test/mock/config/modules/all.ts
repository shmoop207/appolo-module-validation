import {App} from "appolo";
import {ValidationModule} from "../../../../";

export = async function (app: App) {

    await app.module(ValidationModule)
}


