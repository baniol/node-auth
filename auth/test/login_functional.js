// var should = require('should'),
//     Zombie = require('zombie'),
//     assert = require('assert'),
//     server = require('../server/server');

// server.startServer();

// describe('Browser',function(){
//   var browser = new Zombie();
//   it('Check if login form is correct on /',function(done){
//       browser.visit('http://localhost:8080', function() {
//         assert.ok(browser.success);
//         // assert.equal(browser.location.pathname, "/thankyou");
//         browser.text('title').should.include('Sign in');
//         browser.text('button[type=submit].btn-primary').should.include('Sign in');
//         return done();
//       });
//   });
// });