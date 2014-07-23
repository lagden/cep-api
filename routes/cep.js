'use strict';
var CEP = require('../controllers/cep');

var express = require('express'),
    path = require('path'),
    router = express.Router(),
    unqlite = require('unqlite'),
    correio = require('../lib/correio'),
    cepRegex = /^(\d{5})\-?(\d{3})$/;

var DB = unqlite.Database,
    dbFile = path.join(__dirname, '../db/cep.db');



router.get('/', function(req, res) {
    res.send('<pre>Como usar: \n\n - http://api-cep.herokuapp.com/cep/09715-295\n - http://api-cep.herokuapp.com/cep/09715295</pre>');
});

router.get('/:cep', function(req, res, next) {
    console.log('-------------------');
    CEP.find(req, res, next);
});

module.exports = router;