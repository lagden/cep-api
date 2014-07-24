CEP API v1
==========

 - [API](http://api-cep.herokuapp.com/)
 - [Documentação](http://docs.cepapiv1.apiary.io/)
 - [Source](https://github.com/lagden/cep-api)
 - [Exemplo](http://codepen.io/lagden/pen/fArzv?editors=101)

## Instalação

    git clone https://github.com/lagden/cep-api.git
    cd cep-api
    npm install

## Executando

    npm start

## Como funciona

A `API` na verdade é um parse do resultado da página de consulta de cep do site dos correios. O resultado é armazenado em um banco de dados para que futuramente não tenha a necessidade de fazer o parse.

### Prós

- Os dados sempre atualizados

### Contras

- Se a página do correio for alterada ou estiver fora do ar, a `API` funcionará apenas com os dados que foram armazenados no banco de dados

## TODO

- Cache inteligente para que tenha uma atualização constante
    - Verifica a data de validade do CEP
    - Faz uma nova consulta nos correios
    - Se retornar dados e os dados forem diferentes do atual
    - Então atualiza o CEP
    - Senão atualiza a data de validade do CEP

- Robo para preencher o banco com o range de CEPs do Brasil

## Author

[Thiago Lagden](http://lagden.in)

## Contributors

- [Jean Carlo Nascimento (Suissa)](https://github.com/suissa)