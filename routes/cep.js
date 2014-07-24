'use strict';

var express = require('express'),
    path    = require('path'),
    cep     = require('../controllers/cep'),
    router  = express.Router();

router.get('/', function(req, res, next) {
    res.send('<pre>Como usar: \n\n - /cep/09715-295\n - /cep/09715295</pre>');
});

router.get('/:cep', cep.consulta);

module.exports = router;
