CEP API
=======

 - [Documentação](http://docs.cepapiv1.apiary.io/)
 - [Source](https://github.com/lagden/cep-api)
 - [Exemplo](http://codepen.io/lagden/pen/fArzv?editors=101)

## Instalação

    git clone https://github.com/lagden/cep-api.git
    cd cep-api
    npm i -d

## Executando

    npm start

## Como funciona

A `API` na verdade é um parse do resultado da página de consulta de CEP do site dos correios. O resultado é armazenado em um banco de dados para que não tenha a necessidade de fazer uma nova consulta.

### Boa notícia

- Os dados sempre atualizados

### Má notícia

- Se a página do correio for alterada ou estiver fora do ar, a `API` funcionará apenas com os dados que foram armazenados no banco de dados
- Bem que a notícia não é tão má! Basta atualizar a [lib principal](https://github.com/lagden/io-cep)

## TODO

- [x] Cache inteligente para que tenha uma atualização constante
    - [x] Verifica a data de validade do CEP
    - [x] Se expirou então faz uma nova consulta nos correios
    - [x] Se retornar dados e os dados forem diferentes do atual então atualiza o CEP
    - [x] Do contrário atualiza apenas a data de validade do CEP
- [ ] Robo para preencher o banco com a faixas de CEP do Brasil `01000-000` até `99999-999`

## Author

[Thiago Lagden](http://lagden.in)

## Contributors

- [Jean Carlo Nascimento (Suissa)](https://github.com/suissa)
- [Gabriel Pedro](https://github.com/gpedro)
