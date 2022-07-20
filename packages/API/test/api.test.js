import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const { it, describe } = mocha;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

describe('Patients', () => {
  describe('GET /patients ', () => {
    it('should respond with 404', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('POST /api/patients ', () => {
    it('should respond with 400', (done) => {
      chai.request(server)
        .post('/api/patients')
        .send()
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql({});
          res.text.should.be.eql('Please provide facility location!');
          done();
        });
    });
    it('should respond with 200', (done) => {
      const facilityLocation = {
        longitude: -43,
        latitude: 200,
      };
      chai.request(server)
        .post('/api/patients')
        .send(facilityLocation)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(10);
          done();
        });
    });
  });
});
