"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai = require("chai");
const request = require("supertest");
const appolo_1 = require("appolo");
const index_1 = require("../../index");
const decorators_1 = require("../../module/src/decorators");
const should = chai.should();
describe('Appolo Express Unit', () => {
    describe('validations', () => {
        let app;
        beforeEach(async () => {
            app = await new appolo_1.App({
                environment: 'testing',
                root: process.cwd() + '/test/mock',
                port: 8183
            }).launch();
        });
        afterEach(async () => {
            await app.reset();
        });
        it('should remove unknown fields from model', async () => {
            let res = await request(app.handle)
                .get('/test/validations?userName=jon&anotherOne=shouldnotbe');
            res.should.have.status(200);
            res.should.be.json;
            should.exist(res.body);
            res.body.model.should.be.deep.equal({ userName: 'jon' });
        });
        it('should still keep unknown fields from model', async () => {
            let res = await request(app.handle)
                .get('/test/validations2?userName=jon&anotherOne=shouldnotbe');
            res.should.have.status(200);
            res.should.be.json;
            should.exist(res.body);
            res.body.model.should.be.deep.equal({ userName: 'jon' });
        });
        it('should still keep unknown fields from model', async () => {
            let res = await request(app.handle)
                .get('/test/validations3?userName=jon&anotherOne=shouldnotbe');
            res.should.have.status(200);
            res.should.be.json;
            should.exist(res.body);
            res.body.model.should.be.deep.equal({ userName: 'jon', anotherOne: 'shouldnotbe' });
        });
        it('should still keep unknown fields with route model', async () => {
            let res = await request(app.handle)
                .get('/test/validations4/param2?userName=jon&id=shouldnotbe&test=1&test2=2');
            res.should.have.status(200);
            res.should.be.json;
            should.exist(res.body);
            res.body.model.should.be.deep.equal({
                "userName": "jon",
                "id": "shouldnotbe",
                "test": "1",
                "test2": 2
            });
        });
    });
    it("should validate nested object ", function () {
        class Test3 {
        }
        tslib_1.__decorate([
            index_1.param(index_1.joi.bool().required())
        ], Test3.prototype, "c", void 0);
        class Test2 {
        }
        tslib_1.__decorate([
            index_1.param(Test3)
        ], Test2.prototype, "b", void 0);
        class Test1 {
        }
        tslib_1.__decorate([
            index_1.param([Test2])
        ], Test1.prototype, "a", void 0);
        let schema = appolo_1.Util.getReflectData(decorators_1.RouterModelSymbol, Test1);
        let result = index_1.joi.validate({ a: [{ b: { c: true } }] }, schema);
        let result2 = index_1.joi.validate({ a: [{ b: { c: "aaa" } }] }, schema);
        should.not.exist(result.error);
        result2.error.toString().should.include('"c" must be a boolean');
    });
});
//# sourceMappingURL=validatorSpec.js.map