/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {

      test('test POST /api/threads/:board', function(done) {
        chai.request(server)
          .post('/api/threads/mice')
          .send({text: 'mica', delete_password: '123'})
          .end((err, res) => {
            assert.equal(res.status, 200)
          
            done()
          })
      })
    });
    
    suite('GET', function() {

      test('test GET /api/threads/:board', function(done) {
        chai.request(server)
        .get('/api/threads/mice')
        .end((err, res) => {
          assert.equal(res.status, 200)

          done()
        })
      })
      
    });
    
    suite('DELETE', function() {

      test('test DELETE /api/threads/:board', function(done) {
        chai.request(server)
          .delete('/api/threads/muce')
          .send({thread_id: '5bed9f6d8cccdc243788fac4', delete_password: '123'})
          .end((err, res) => {
            assert.equal(res.status, 200)

            done()
          })
      })
      
    });
    
    suite('PUT', function() {
      
      test('test PUT /api/threads/:board', function(done) {
        chai.request(server)
          .put('/api/threads/mice')
          .send({thread_id: 'mice'})
          .end((err, res) => {
            assert.equal(res.status, 200)

            done()
          })
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {

      test('test POST /api/replies/:board', function(done) {
        chai.request(server)
          .post('/api/replies/mice')
          .send({text: 'Luna', delete_password: '123'})
          .end((err, res) => {
            assert.equal(res.status, 200)
          
            done()
          })
      })
      
    });
    
    suite('GET', function() {
      
      test('test GET /api/replies/:board', function(done) {
        chai.request(server)
          .get('/api/replies/mice')
          .end((err, res) => {
            assert.equal(res.status, 200)
          
            done()
          })
        })
    });
    
    suite('PUT', function() {
      
      test('test PUT /api/replies/:board', function(done) {
        chai.request(server)
          .put('/api/replies/mice')
          .send({thread_id: '', reply_id: ''})
          .end((err, res) => {
            assert.equal(res.status, 200)
          
            done()
          })
        })
    });
    
    suite('DELETE', function() {
      
      test('test DELETE /api/replies/:board', function(done) {
        chai.request(server)
          .delete('/api/replies/mice')
          .send({thread_id: '5bed9f6d8cccdc243788fac4', reply_id: '5beda0668cccdc243788fac5', delete_password: '123'})
          .end((err, res) => {
            assert.equal(res.status, 200)
          
            done()
          })
        })
    });
    
  });
  
})
