const express = require ('express');
const routes = require('./routes/targetRoute'); 
var healthPoint = require('healthpoint')

var redis = require('./redis')
var version = require('../package.json').version

var audit = require('express-requests-logger')
var errorlog = require('express-errorlog');

var health = healthPoint({ version: version }, redis.healthCheck)
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "myapp"});
const app = express();
app.use(express.json());
app.use(errorlog);

app.use(audit({
  logger: log, // Existing bunyan logger
  request: {
      maskBody: ['password'], // Mask 'password' field in incoming requests
      excludeHeaders: ['authorization'], // Exclude 'authorization' header from requests
      excludeBody: ['creditCard'], // Exclude 'creditCard' field from requests body
      maskHeaders: ['header1'], // Mask 'header1' header in incoming requests
      maxBodyLength: 50 // limit length to 50 chars + '...'
  },
  response: {
      maskBody: ['session_token'], // Mask 'session_token' field in response body
      excludeHeaders: ['*'], // Exclude all headers from responses,
      excludeBody: ['*'], // Exclude all body from responses
      maskHeaders: ['header1'], // Mask 'header1' header in incoming requests
      maxBodyLength: 50 // limit length to 50 chars + '...'
  }
}));

app.use('/targets/', routes); 
app.get('/health', health); 

module.exports=app;
