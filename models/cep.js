'use strict';

var unqlite = require('unqlite'),
    async   = require('async'),
    path    = require('path');

var DB     = unqlite.Database,
    dbFile = path.join(__dirname, '../db/cep.db');

function CepRepository() {
    if (false === (this instanceof CepRepository))
        return new CepRepository();

    this.db = new DB(dbFile);
}

CepRepository.prototype = {
    open: function(callback) {
        this.db.open(unqlite.OPEN_CREATE, function(err) {
            if (err)
                throw err;

            console.log('abriu o db');

            callback(err);
        });
    },
    close: function(callback) {
        this.db.close(function(err) {
            if (err)
                throw err;

            console.log('fechou o db');

            if (callback)
                callback(err);
        });
    },
    fetch: function(key, callback) {
        console.log('consulta o db');
        this.db.fetch(key, function(err, k, v) {
            callback(err, v);
        });
    },
    store: function(key, value, callback) {
        console.log('salva no db');
        this.db.store(key, value, function(err, k, v) {
            callback(err, v);
        });
    }
};

exports.find = function(key, callback) {
    var instance = CepRepository();
    async.waterfall([
        instance.open.bind(instance),
        instance.fetch.bind(instance, key),
    ], function(err, result) {
        instance.close(function(){
            callback(err, result);
        });
    });
};

exports.save = function(key, value, callback) {
    var instance = CepRepository();
    async.waterfall([
        instance.open.bind(instance),
        instance.store.bind(instance, key, value),
    ], function(err, result) {
        instance.close(function(){
            callback(err, result);
        });
    });
};
