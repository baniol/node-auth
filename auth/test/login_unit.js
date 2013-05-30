var should = require('should'),
    assert = require('assert'),
    path = require('path'),
    mocha = require('mocha'),
    superagent = require('superagent'),
    server = require('../server/server'),
    conf = require('../../config');

var testEmail = 'test@test.com',
    testPassword = 'asdfasdf';

server.startServer();

var agent = superagent.agent(),
    serverUrl = conf.server_protocol+conf.server_domain+':'+conf.server_port;

describe('Login',function(){

  it('start page',function(done){
    agent.get('/').end(function(res){
      res.should.have.status(200);
      return done();
    });
  });

  it('Wrong login email',function(done){
    agent
    .post(serverUrl)
    .send({ email: 'asdf@asdf.dd', password: 'wrong' })
    .end(function(res){
      res.should.have.status(400);
      res.text.should.include('Incorrect email or password!');
      return done();
    });
  });

  it('Email ok, but wrong password',function(done){
    agent
    .post(serverUrl)
    .send({ email: testEmail, password: 'wrong' })
    .end(function(res){
      res.should.have.status(400);
      res.text.should.include('Incorrect email or password!');
      return done();
    });
  });

  it('Credentials ok, login',function(done){
    userLogin(function(res){
      // res.should.be.json;
      // res.body.should.have.property('email',testEmail);
      // res.body.should.have.property('id');
      // res.body.should.have.property('username',null);
      // res.body.should.have.property('password');
      // res.body.should.have.property('createdAt');
      // res.body.should.have.property('updatedAt');
      res.should.have.status(200);
      return done();
    });
  });

  it('Logout',function(done){
    userLogin(function(){
      agent
      .get(serverUrl+'/logout')
      .end(function(res){
        res.redirects.should.eql(['http://localhost:8080/']);
        return done();
      });
    });
  });
});

userLogin = function(fn){
  agent
    .post(serverUrl)
    .send({ email: testEmail, password: testPassword })
    .end(function(res){
      fn(res);
    });
}

// ********************* REGISTER ***************
describe('REGISTER USER',function(){
  it('If all fields empty, return error',function(done){
    agent
    .post(serverUrl+'/register')
    .send({ email: '', password: '' , confirm:'' })
    .end(function(res){
      res.should.have.status(400);
      res.text.should.be.string;
      // parse json string with error parameters
      var er = JSON.parse(res.text);
      er.should.be.an.instanceOf(Array);
      er.forEach(function(o){
        o.should.have.property('param');
        o.should.have.property('msg');
        o.should.have.property('value');
      });
      // res.text.should.include('Incorrect email or password!');
      return done();
    });
  });
});

// @todo - more register tests

// describe('Forgot password',function(){
//   it('');
// });