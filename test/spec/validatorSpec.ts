import chai = require('chai');
import request = require('supertest');
import {App} from 'appolo';

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
});
