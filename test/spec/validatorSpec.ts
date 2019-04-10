import chai = require('chai');
import request = require('supertest');
import {App, Util} from 'appolo';
import {param, joi} from "../../index";
import {RouterModelSymbol} from "../../module/src/decorators";

const should = chai.should();

describe('Appolo Express Unit', () => {

    describe('validations', () => {

        let app: App;

        beforeEach(async () => {
            app = await new App({
                environment: 'testing',
                root: process.cwd() + '/test/mock',
                port: 8183
            }).launch();
        })

        afterEach(async () => {
            await app.reset();
        });

        it('should remove unknown fields from model', async () => {


            let res = await request(app.handle)
                .get('/test/validations?userName=jon&anotherOne=shouldnotbe');

            res.should.have.status(200);
            res.should.be.json;

            should.exist(res.body);

            res.body.model.should.be.deep.equal({userName: 'jon'});
        });

        it('should still keep unknown fields from model', async () => {


            let res = await request(app.handle)
                .get('/test/validations2?userName=jon&anotherOne=shouldnotbe');

            res.should.have.status(200);
            res.should.be.json;

            should.exist(res.body);

            res.body.model.should.be.deep.equal({userName: 'jon'});
        });

        it('should still keep unknown fields from model', async () => {

            let res = await request(app.handle)
                .get('/test/validations3?userName=jon&anotherOne=shouldnotbe');

            res.should.have.status(200);
            res.should.be.json;

            should.exist(res.body);

            res.body.model.should.be.deep.equal({userName: 'jon', anotherOne: 'shouldnotbe'});
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
            @param(joi.bool().required())
            c: boolean
        }

        class Test2 {
            @param(Test3)
            b: Test3
        }


        class Test1 {
            @param([Test2])
            a: Test2[]
        }

        let schema = Util.getReflectData(RouterModelSymbol, Test1);

        let result = joi.validate({a: [{b: {c: true}}]},schema);
        let result2 = joi.validate({a: [{b: {c: "aaa"}}]},schema);

        should.not.exist(result.error);

        result2.error.toString().should.include('"c" must be a boolean');

    })
});
