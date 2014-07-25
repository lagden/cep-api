'use strict';

var path = require('path');
var bunyan = require('bunyan');

var env = process.env.NODE_ENV || 'development';
var loggy;

if (env === 'production')
    loggy = bunyan.createLogger({
        name: 'cep',
        streams: [{
            path: path.join(__dirname, '../logs/cep.log'),
            type: 'rotating-file',
            period: 'hourly',
            level: bunyan.DEBUG,
            count: 30
        }]
    });
else
    loggy = {
        debug: function(arg) {
            console.log(arg);
        }
    };

module.exports = loggy;
