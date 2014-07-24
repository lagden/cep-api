'use strict';

var correio = require('../lib/correio'),
    db      = require('../models/cep');

var resposta = function(res, data, success) {
    console.log('---- end ----');
    success = success || false;
    data = data || {};
    data['success'] = success;
    res.send(data);
};

var sedex = function(res, cep, data) {
    if (data) {
        data['cache'] = Date.now();
        db.save(cep, JSON.stringify(data), function(err, k, v) {
            if (err)
                console.log('---- não salvou ----');

            // Mesmo assim retorna o resultado da consulta
            resposta(res, data, true);
        });
    } else
        resposta(res, {
            'msg': 'CEP não encontrado'
        });
};

exports.consulta = function(req, res, next) {
    console.log('---- init ----');
    var cep = req.params.cep,
        rawcep;

    if (/^(\d{5})\-?(\d{3})$/.test(cep)) {
        rawcep = cep.split('-').join('');
        db.find(rawcep, function(err, data) {
            if (data)
                resposta(res, JSON.parse(data), true);
            else
                correio(rawcep, function(err, data) {
                    sedex(res, rawcep, data);
                });
        });
    } else
        resposta(res, {
            'msg': 'CEP inválido'
        });
};
