'use strict';

var express = require('express'),
    path = require('path'),
    router = express.Router(),
    unqlite = require('unqlite'),
    correio = require('../lib/correio'),
    cepRegex = /^(\d{5})\-?(\d{3})$/;

var DB = require('../models/cep');
    

var respostaFinal = function(res, data, success) {
    success = success || false;
    data['success'] = success;
    res.send(data);
}
var CEP  = { 

    find: function(req, res, next){
        var rawcep,
            cep,
            db;
        cep = req.params.cep;
        if (cepRegex.test(cep)) {
            rawcep = cep.split('-').join('');
            // Abre conexao com o banco
            DB.find(res, rawcep);
        } else {
            respostaFinal(res, {
                "msg": "cep inválido"
            });
        }

    }
};

module.exports = CEP;