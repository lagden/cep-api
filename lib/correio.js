'use strict';

var exec = require("child_process").exec;
var cheerio = require('cheerio');

var parseData = function(html) {
    var $,
        $respostas,
        tmp,
        tmpKeys;

    $ = cheerio.load(html);
    tmp = {};
    $respostas = $('.resposta');

    for (var i = 0, len = $respostas.length; i < len; i++) {
        var $el = $($respostas[i]);
        var key = String($el.text()).trim().replace(':', '').replace('/', '-');
        var value = String($el.next('.respostadestaque').text()).trim();
        if (key.indexOf('Localidade') !== -1) {
            var keys = key.split('-');
            var values = value.replace(/[\n\t]+/g, '').split('/');
            tmp[keys[0].trim().toLowerCase()] = values[0].trim();
            tmp[keys[1].trim().toLowerCase()] = values[1].trim();
        } else {
            tmp[key.toLowerCase()] = value;
        }
    }
    tmpKeys = Object.keys(tmp);
    return (tmpKeys.length > 0) ? tmp : null;
}

var correio = function(cep, callback) {
    var fields = [
        'cepEntrada=' + cep,
        'tipoCep=',
        'cepTemp=',
        'metodo=buscarCep',
    ].join('&');
    var cmd = 'curl --compressed -X POST http://m.correios.com.br/movel/buscaCepConfirma.do -d "' + fields + '" | iconv -f iso8859-1 -t utf-8';

    // console.log(cmd);
    console.log('consultou no correio...');

    exec(cmd, function(err, stdout, stderr) {
        var data = null;
        if (err)
            console.log(stderr);
        else
            data = parseData(stdout);

        callback(err, data);
    });
}

module.exports = correio;