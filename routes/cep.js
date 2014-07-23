'use strict';

var express = require('express'),
    path = require('path'),
    router = express.Router(),
    unqlite = require('unqlite'),
    correio = require('../lib/correio'),
    cepRegex = /^(\d{5})\-?(\d{3})$/;

var DB = unqlite.Database,
    dbFile = path.join(__dirname, '../db/cep.db');

var closeDB = function(db) {
    db.close(function(err) {
        if (err)
            console.log('db.close', err);
        else
            console.log('db.close', 'fechadoo...');
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
    console.log('-------------------');

    var rawcep,
        cep,
        db;

    cep = req.params.cep;
    if (cepRegex.test(cep)) {

        rawcep = cep.split('-').join('');

        // Abre conexao com o banco
        db = new DB(dbFile);
        db.open(unqlite.OPEN_CREATE, function(err) {
            if (err) {
                closeDB(db);
                next(new Error('unqlite open'));
            } else {
                console.log('db.open', 'abriuuu...');
                // Localiza o cep no banco
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

                                    closeDB(db);
                                    respostaFinal(res, data, true);
                                });
                            // senão a consulta #fail
                            } else {
                                closeDB(db);
                                respostaFinal(res, {
                                    "msg": "cep não encontrado"
                                });
                            }
                        });
                    // achou!!
                    } else {
                        console.log('achou no banco...');
                        closeDB(db);
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