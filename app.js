const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

//Cria o objeto app para criar a API
const app = express()

//Porta
const PORT = process.PORT || 8080

//Configurações do cors
app.use((request, response, next) => {
    response.header('acess-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Import das controller da API
const controllerFilme = require('./controller/filme/controller_filme.js')
const controllerGenero = require('./controller/genero/controller_genero.js')

//Endpoints para o CRUD de filmes


//Retorna a lista de filmes
app.get('/v1/locadora/filme', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()
    console.log(filme)
    response.status(filme.status_code)
    response.json(filme)
})


//Retorna um filme filtrando pelo ID
app.get('/v1/locadora/filme/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parametro
    let idFilme = request.params.id

    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})


// Insere um novo filme no BD
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição 
    let dadosBody = request.body

    //Recebe o content Type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})


//Atualiza um filme existente no Banco de Dados
app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do filme encaminhado pela url
    let idFilme = request.params.id

    //Recebe o content Type da requisição
    let contentType = request.headers['content-type']


    //Chama a função da controller para atualizar o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

//Apaga um Filme existente no Banco de Dados 
app.delete('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function (request, response) {

    //Recebe o id do filme encaminhado pela url
    let idFilme = request.params.id

    //Chama a função da controller para excluir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

//Retorna a lista de gêneros
app.get('/v1/locadora/genero', cors(), bodyParserJSON, async function (request, response) {

    //Chama a função da controller para listar todos os gêneros
    let genero = await controllerGenero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)
})


//Retorna um gênero filtrando por ID
// app.get('v1/locadora/genero/:id', cors(), bodyParserJSON, async function (request, response) {

//     //Recebe o id do gênero encaminhado pela url
//     let idGenero = request.params.id
//     //Chama a função da controller para listar um gênero filtrando por ID
//     let genero = await controllerGenero.buscarGeneroId(idGenero)

//     response.status(genero.status_code)
//     response.json(genero)
// })


app.get('/v1/locadora/genero/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parametro
    let idGenero = request.params.id

    //Chama a função da controller para retornar todos os filmes
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})


app.post('/v1/locadora/genero', cors(), bodyParserJSON, async function (request, response) {
     //Recebe o objeto JSON pelo body da requisição 
     let dadosBody = request.body

     //Recebe o content Type da requisição
     let contentType = request.headers['content-type'] 

     let genero = await controllerGenero.inserirGenero(dadosBody, contentType)   

    response.status(genero.status_code)
    response.json(genero)
    
})

app.put('/v1/locadora/genero/:id', cors(), bodyParserJSON, async function (request, response){

    let dadosBody = request.body
    let idGenero = request.params.id
    let contentType = request.headers ['content-type']

    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)
})


app.delete('/v1/locadora/genero/:id', cors(), bodyParserJSON, async function (request, response){

    let idGenero = request.params.id

    let genero = await controllerGenero.excluirGenero(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

app.listen(PORT, function () {
    console.log('API aguardando requisições!!!')
})