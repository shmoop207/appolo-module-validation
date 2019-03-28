# Appolo validations Module

You can add validations to your routes. The action controller will be called only if the route params are valid.<br/>
Validations are done using [joi module](https://github.com/hapijs/joi  ).<br/>
The validator takes request params from `req.param` , `req.query` and `req.body`. After validation, all request params will be available on `req.model`.


## Installation
```typescript
npm i @appolo/validation
```

## Options

any options from joi validate [options](https://github.com/hapijs/joi/blob/v14.3.1/API.md#validatevalue-schema-options-callback)
| key | Description | Type | Default
| --- | --- | --- | --- |
| `abortEarly` | when true, stops validation on the first error, otherwise returns all the errors found. | `boolean`|  `false`|
| `convert` | when true, attempts to cast values to the required types (e.g. a string to a number) | `boolean` | `true` |
| `allowUnknown` | when true, allows object to contain unknown keys which are ignored | `boolean` | `true` |
| `stripUnknown` |  remove unknown elements from objects and arrays| `boolean` | `true` |

in config/modules/all.ts

```typescript
import {App} from 'appolo';
import {ValidationModule} from '@appolo/validation';

export = async function (app:App) {

    await app.module(new ValidationModule({
        allowUnknown:true
    }));
}
```
## Usage
### Validate Object
validate with object
```typescript
import {controller,inject,Controller,IRequest,IResponse,get} from 'appolo';
import {joi,validate} from '@appolo/validation';

@controller()
export class TestController extends Controller{
    @inject() dataManager:DataManager

    @get("/search/")
    @validate({
        search:joi.string().required(),
        pageSize:joi.number().default(20),
        page:joi.number().default(1)
    })
    public async search (req:IRequest, res:IResponse,model:any) {
        let {search,page,pageSize} = model;
        return await this.dataManager.search(search,page,pageSize)
    }
}
```
### Validate Params
validate with params
```typescript
import {controller,inject,Controller,IRequest,IResponse,get} from 'appolo';
import {joi,validate} from '@appolo/validation';

@controller()
export class TestController extends Controller{
    @inject() dataManager:DataManager

    @post("/login/")
    @validate("name",joi.string().required())
    @validate("pass",joi.string().required())
    public async login (req:IRequest, res:IResponse,model:any) {
    
        let {name,pass} = model;
            return await this.dataManager.login(name,pass)
    }
}
```


### Custom Options
custom validate [options](https://github.com/hapijs/joi/blob/v14.3.1/API.md#validatevalue-schema-options-callback) can be applied to each `validate`
```typescript
import {controller,inject,Controller,IRequest,IResponse,get} from 'appolo';
import {joi,validate} from '@appolo/validation';

@controller()
export class TestController extends Controller{
    @inject() dataManager:DataManager

    @get("/search/")
    @validate({
        search:joi.string().required(),
        pageSize:joi.number().default(20),
        page:joi.number().default(1)
    },{stripUnknown:false})
    public async search (req:IRequest, res:IResponse,model:any) {
        let {search,page,pageSize} = model;
        return await this.dataManager.getSearchResults(search,page,pageSize)
    }
}
```
### Validation Fail
If the request params are not valid, appolo will return a `400 Bad Request` response with detailed validation errors.
```typescript
{
    status: 400,
    message: "Bad Request",
    error: "userId is required"  
}
```

### Validation Model
`appolo` also supports validation model
```typescript
import {joi,validate,param} from '@appolo/validation';

export class SearchModel {
    
    @param(joi.string().required())
    search: string;

    @param(joi.number().required())
    pageSize: number

    @param(joi.number().default(1))
    page: number
}
```

then in the controller
```typescript
import {controller,inject,Controller,IRequest,IResponse,validator,get} from 'appolo';
@controller()
export class TestController extends Controller{

    @inject() dataManager:DataManager

    @get("/search/")
    @validations(SearchModel)
    public async search (req:IRequest, res:IResponse,model:SearchModel) {
       let {search,page,pageSize} = model;
       return await this.dataManager.getSearchResults(search,page,pageSize)
    }
}
```
#### Custom options
```typescript
import {joi,validate,param,schema} from '@appolo/validation';

@schema({stripUnknown:false})
export class SearchModel {
    
    @param(joi.string().required())
    search: string;

    @param(joi.number().required())
    pageSize: number

    @param(joi.number().default(1))
    page: number
}
```

#### Inherit Model
```typescript
import {joi,validate,param,schema} from '@appolo/validation';

export class BaseSearchModel {
     @param(joi.string().required())
      search: string;
}

export class SearchModel extends BaseSearchModel{
    
    @param(joi.number().required())
    pageSize: number

    @param(joi.number().default(1))
    page: number
}
```

#### Nested Model
```typescript
import {joi,validate,param,schema} from '@appolo/validation';

export class SearchModel {
     @param(joi.string().required())
     search: string;
     @param(joi.number().required())
     pageSize: number
     
     @param(joi.number().default(1))
     page: number
}

export class PageModel{
    
    @param(SearchModel)
    search:SearchModel
    
    @param([SearchModel])
    searches:SearchModel[]
    
    @param([SearchModel],joi.required())
    searches2:SearchModel[]
}
```
