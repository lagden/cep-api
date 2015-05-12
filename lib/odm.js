'use strict';

var unqlite = require('unqlite');
var path = require('path');

var file = path.join(__dirname, '../db/cep.db');

function ODM() {
  if (false === (this instanceof ODM))
    return new ODM();

  this.db = new unqlite.Database(file);
}

ODM.prototype = {
  open: function(callback) {
    this.db.open(unqlite.OPEN_CREATE, function(err) {
      if (err)
        throw err;

      callback(err);
    });
  },
  close: function(callback) {
    this.db.close(function(err) {
      if (err)
        throw err;

      if (callback)
        callback(err);
    });
  },
  fetch: function(key, callback) {
    this.db.fetch(key, function(err, k, v) {
      callback(err, v);
    });
  },
  store: function(key, value, callback) {
    this.db.store(key, value, function(err, k, v) {
      callback(err, v);
    });
  }
};

module.exports = ODM;
