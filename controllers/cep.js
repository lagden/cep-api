'use strict';

var correio = require('io-cep');
var db = require('../models/cep');

var resposta = function(res, data, success) {
  success = success || false;
  data = data || {};
  data['success'] = success;
  res.send(data);
};

var sedex = function(res, cep, data) {
  if (data.success) {
    data['cache'] = Date.now();
    db.save(cep, JSON.stringify(data), function(err, k, v) {
      if (err) {
        throw (err);
      }
      resposta(res, data, true);
    });
  } else
    resposta(res, {
      'success': false,
      'msg': 'CEP não encontrado'
    });
};

var cache = function(res, atual) {
  var data,
    expira = 604800; // 1 semana de validade

  if (atual.cache + expira < Date.now()) {
    correio(atual.cep, function(err, nova) {
      if (nova.success) {
        delete atual.cache;
        data = (JSON.stringify(atual) === JSON.stringify(nova)) ? atual : nova
      } else {
        data = atual;
      }
      sedex(res, data.cep, data);
    });
  } else {
    resposta(res, atual, true);
  }
};

exports.consulta = function(req, res, next) {
  var cep = req.params.cep;
  var rawcep;

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
  } else {
    resposta(res, {
      'success': false,
      'msg': 'CEP inválido'
    });
  }
};
