'use strict';

var express = require('express'),
    path = require('path'),
    router = express.Router(),
    unqlite = require('unqlite'),
    correio = require('../lib/correio'),
    db = new unqlite.Database(path.join(__dirname, '../db/cep.db')),
    cepRegex = /^(\d{5})\-?(\d{3})$/;

var closeDB = function(next) {
    db.close(function(err) {
        if (err)
            console.log('db.close', err);
    });
}

var respostaFinal = function(res, data, success) {
    success = success || false;
    data['success'] = success;
    res.send(data);
}

router.get('/', function(req, res) {
    res.send('<pre>Como usar: /cep/09715-295 ou /cep/09715295</pre>');
});

router.get('/:cep', function(req, res, next) {
    var rawcep,
        cep;

    cep = req.params.cep;
    if (cepRegex.test(cep)) {
        rawcep = cep.split('-').join('');

        // Abre conexao com o banco
        db.open(unqlite.OPEN_CREATE, function(err) {
            if (err) {
                closeDB();
                next(err);
            } else {
                // Localiza o cep
                db.fetch(rawcep, function(err, k, v) {
                    // Se não achou então...
                    if (err) {
                        console.log('db.fetch', err);
                        // Consulta no correio...
                        correio(rawcep, function(err, data) {
                            // Se achou então grava no banco...
                            if (data) {
                                db.store(rawcep, JSON.stringify(data), function(err, k, v) {
                                    if (err)
                                        console.log('db.store', err);
                                    else
                                        console.log('db.store - gravou', k);

                                    closeDB();
                                    respostaFinal(res, data, true);
                                });
                            // senão a consulta #fail
                            } else {
                                respostaFinal(res, {
                                    "msg": "cep não encontrado"
                                });
                            }
                        });
                    // achou!!
                    } else {
                        console.log('achou no banco...');
                        closeDB();
                        respostaFinal(res, JSON.parse(v), true);
                    }
                });
            }
        });
    } else {
        respostaFinal(res, {
            "msg": "cep inválido"
        });
    }
});

module.exports = router;