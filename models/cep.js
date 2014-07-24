'use strict';

var async   = require('async'),
    odm     = require('./../lib/odm')();

exports.find = function(key, callback) {
    async.waterfall([
        odm.open.bind(odm),
        odm.fetch.bind(odm, key),
    ], function(err, result) {
        odm.close(function(){
            callback(err, result);
        });
    });
};

exports.save = function(key, value, callback) {
    async.waterfall([
        odm.open.bind(odm),
        odm.store.bind(odm, key, value),
    ], function(err, result) {
        odm.close(function(){
            callback(err, result);
        });
    });
};
