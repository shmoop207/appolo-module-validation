"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const request = require("supertest");
const appolo_1 = require("appolo");
const sinonChai = require("sinon-chai");
const chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);
describe('validations e2e', () => {
    let app;
    beforeEach(async () => {
        app = appolo_1.createApp({
            port: 8183,
            environment: "testing",
            root: process.cwd() + '/test/mock/',
        });
        await app.launch();
    });
    afterEach(async () => {
        await app.reset();
    });
    describe('validations', function () {
        it('should should call with validation error', async () => {
            let res = await request(app.handle)
                .get('/test/validations/?user2_name=11');
            res.should.to.have.status(400);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.error.should.contain("ValidationError: child \"userName\"");
            res.body.message.should.contain("Bad Request");
        });
        it('should call validations error', async () => {
            let res = await request(app.handle)
                .get('/test/validations2/');
            res.should.to.have.status(400);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.error.should.be.ok;
        });
        it('should call validations with camelCase', async () => {
            let res = await request(app.handle)
                .get('/test/validations3/?userName=test');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.userName.should.be.ok;
        });
        it('should call validations ', async () => {
            let res = await request(app.handle)
                .get('/test/validations/auth/?username=aaa&password=1111');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.username.should.be.ok;
        });
        it('should call validations param', async () => {
            let res = await request(app.handle)
                .get('/test/validations/param?test=aaa&test2=2');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.test.should.be.eq("aaa");
            res.body.name.should.be.eq("ValidationParamController");
        });
        it('should call validations param object', async () => {
            let res = await request(app.handle)
                .get('/test/validations/param_object?b=1&a[test]=aaa&a[test2]=2');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.a.test.should.be.eq("aaa");
            res.body.name.should.be.eq("ValidationParamController");
        });
        it('should call validations param inherit', async () => {
            let res = await request(app.handle)
                .get('/test/validations/param2?test=aaa&test2=2&id=www');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.test.should.be.eq("aaa");
            res.body.id.should.be.eq("www");
            res.body.name.should.be.eq("ValidationParamController");
        });
        it('should call validations nested', async () => {
            let res = await request(app.handle)
                .get('/test/nested')
                .query({
                test2: {
                    test: "1"
                }
            });
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.should.be.deep.equal({ test2: { test: '1' } });
        });
    });
});
//# sourceMappingURL=e2eSpec.js.map