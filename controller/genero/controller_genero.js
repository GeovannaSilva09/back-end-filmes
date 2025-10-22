/******************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamentos de dados, tratamento de erros, etc)
 * Data: 22/10/2025
 * Autora: Geovanna
 * versão: 1.0
 * 
 *  Dependências para criar a API:
 *     express              - npm install express       --save Instala as dependencias para criar uma API
 *     cors                 - npm install cors          --save Instala as dependencias para configurar as permissões de uma API
 *     body-parser          - npm install body-parser  --save Instala as dependencias para receber os tipos de dados via POST ou PUT
 *****************************************************************************************************/

//Import do arquivo DAO
const generoDAO = require('../../model/DAO/genero.js')

//Import do arquivo de mensagens
const MESSAGE_DEFAULT = require('../modulo/config.messages.js')

//Retorna a lista de gêneros
const listarGeneros = async function () {

    //Realizando cópia do objeto MESSAGE_DEFAULT, para que as alterações
    // dessa função não interfira em outras funções

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        // Chama a função do DAO para retornar a lista de gêneros
        let result = await generoDAO.getSelectAllGenres()
        if (result) {

            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.genres = result

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}



//Retorna o gênero pelo id add
const buscarGeneroId = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try{
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await generoDAO.getSelectByIdGenres(parseInt(id))
        
           
            if (result) {
                if (result.length > 0){
                    MESSAGE.HEADER.status           =  MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code      =  MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.message          =  MESSAGE.SUCCESS_REQUEST.message
                    MESSAGE.HEADER.response        = result
                    return MESSAGE.HEADER //200
                } else { 
                    return MESSAGE.ERROR_NOT_FOUND //404    
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field     = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Insere um novo gênero

//Atualiza um gênero

//Apaga um gênero

module.exports = {
    listarGeneros,
    buscarGeneroId
}