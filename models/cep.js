var unqlite = require('unqlite'),
    path = require('path');

var DB = unqlite.Database,
    dbFile = path.join(__dirname, '../db/cep.db');

var _db = {
    closeDB: function(db) {
        db.close(function(err) {
            if (err)
                console.log('db.close', err);
            else
                console.log('db.close', 'fechadoo...');
        });
    },
    respostaFinal: function(res, data, success) {
        success = success || false;
        data['success'] = success;
        res.send(data);
    },
    save: function(rawcep, data){
        db.store(rawcep, data, function(err, k, v) {
            if (err)
                console.log('db.store', err);
            else
                console.log('db.store - gravou', k);

            _db.closeDB(db);
            _db.respostaFinal(res, data, true);
        });
    },
    findCep: function(rawcep, res){
        db.fetch(rawcep, function(err, k, v) {
            // Se não achou então...
            if (err) {
                console.log('db.fetch', err);
                // Consulta no correio...
                _db.getCorrerio(rawcep);

            // achou!!
            } else {
                console.log('achou no banco...');
                _db.closeDB(db);
                _db.respostaFinal(res, JSON.parse(v), true);
            }
        });
    },
    getCorreio: function(rawcep){
        correio(rawcep, function(err, data) {
            // Se achou então grava no banco...
            if (data) {
                data['cache'] = Date.now();
                console.log(data);
                _db.save(rawcep, JSON.stringify(data));
            // senão a consulta #fail
            } else {
                _db.closeDB(db);
                _db.respostaFinal(res, {
                    "msg": "cep não encontrado"
                });
            }
        });
    }
}



exports.closeDB = function(res, db) {
    db.close(function(err) {
        if (err)
            console.log('db.close', err);
        else
            console.log('db.close', 'fechadoo...');
    });
}


exports.find = function(res, rawcep){
    db = new DB(dbFile);
    db.open(unqlite.OPEN_CREATE, function(err) {
        if (err) {
            _db.closeDB(db);
            next(new Error('unqlite open'));
        } else {
            console.log('db.open', 'abriuuu...');
            // Localiza o cep no banco
            console.log('rawcep', rawcep);
            _db.findCep(rawcep, res);
        }
    });
}