/******************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamentos de dados, tratamento de erros, etc)
 * Data: 07/10/2025
 * Autora: Geovanna
 * versão: 1.0
 * 
 *  Dependências para criar a API:
 *     express      - npm install express       --save Instala as dependencias para criar uma API
 *     cors         - npm install cors          --save Instala as dependencias para configurar as permissões de uma API
 *     body-parser   - npm install body-parser  --save Instala as dependencias para receber os tipos de dados via POST ou PUT
 *****************************************************************************************************/
//Import do arquivo DAO para manipular o CRUD no BD
const filmeDAO = require('../../model/DAO/filme.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config.messages.js')

//Retorna uma lista de filmes
const listarFilmes = async function () {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de filmes
        let result = await filmeDAO.getSelectallFilms()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = result

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna um filme filtrando pelo ID
const buscarFilmeId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmeDAO.getSelectByIdFilms(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.message = message.SUCESS_REQUEST.message

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Insere um novo filme
const inserirFilme = async function (filme, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {



            if (filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100) {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS

            } else if (filme.sinopse == undefined) {

                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SINOPSE] inválido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS

            } else if (filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {

                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA DE LANÇAMENTO] inválido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS

            } else if (filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8) {

                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DURAÇÃO] inválido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS

            } else if (filme.orcamento == null || filme.orcamento == undefined || typeof (filme.orcamento) != 'number') {

                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ORÇAMENTO] inválido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS

            } else if (filme.trailer == undefined || filme.trailer.length > 200) {

                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [TRAILER] inválido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS

            } else if (filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 200) {

                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CAPA] inválido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS

            } else {
                //Chama a função do DAO para inserir um novo filme
                let result = await filmeDAO.setInsertFilms(filme, contentType)

                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message

                    return MESSAGE.HEADER //201
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

//Atualiza um filme filtrando pelo ID
const atualizarFilme = async function (filme, id) {

}

//Apaga um filme filtrando pelo ID
const excluirFilme = async function (filme) {

}

module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme
}