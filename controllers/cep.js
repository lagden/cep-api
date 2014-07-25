'use strict';

var correio = require('../lib/correio'),
    db = require('../models/cep'),
    loggy = require('../lib/log');

var resposta = function(res, data, success) {
    loggy.debug('---- end ----');
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
                loggy.debug('---- não salvou ----');

            // Mesmo assim retorna o resultado da consulta
            resposta(res, data, true);
        });
    } else
        resposta(res, {
            'msg': 'CEP não encontrado'
        });
};

var cache = function(res, atual) {
    loggy.debug('verificando cache...');

    var data,
        expira = 604800; // 1 semana de validade

    if (atual.cache + expira < Date.now()) {
        loggy.debug('cache expirou...');
        correio(atual.cep, function(err, nova) {
            if (nova) {
                loggy.debug('encontrou o cep...');
                delete atual.cache;
                data = (JSON.stringify(atual) === JSON.stringify(nova)) ? atual : nova
            } else {
                loggy.debug('falha ao consultar os correios...');
                loggy.debug('utilizando dado armazenado no banco...');
                data = atual;
            }
            loggy.debug('atualizando a validade do cep...');
            sedex(res, data.cep, data);
        });
    } else {
        resposta(res, atual, true);
    }
};

exports.consulta = function(req, res, next) {
    loggy.debug('---- init ----');
    var cep = req.params.cep,
        rawcep;

    if (/^(\d{5})\-?(\d{3})$/.test(cep)) {
        rawcep = cep.split('-').join('');
        db.find(rawcep, function(err, data) {
            if (data)
                cache(res, JSON.parse(data));
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
