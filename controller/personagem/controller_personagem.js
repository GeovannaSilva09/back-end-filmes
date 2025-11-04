/******************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamentos de dados, tratamento de erros, etc)
 * Data: 04/11/2025
 * Autora: Geovanna
 * versão: 1.0
 *****************************************************************************************************/

//Import do arquivo DAO
const personagemDAO = require('../../model/DAO/personagem.js')

//Import do arquivo de mensagens
const MESSAGE_DEFAULT = require('../modulo/config.messages.js')

//Retorna a lista de personagens
const listarPersonagens = async function () {

    //Realizando cópia do objeto MESSAGE_DEFAULT, para que as alterações
    // dessa função não interfira em outras funções

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        // Chama a função do DAO para retornar a lista 
        let result = await personagemDAO.getSelectAllCharacters()
        if (result) {

            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.personagem = result

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




//Retorna personagens pelo id
const buscarPersonagemId = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await personagemDAO.getSelectByIdCharacters(parseInt(id))


            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_REQUEST.message
                    MESSAGE.HEADER.response = result
                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404    
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Insere um novo personagem
const inserirPersonagem = async function (personagem, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosPersonagem(personagem)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo personagem
                let result = await personagemDAO.getSelectByIdCharacters(personagem, contentType)
                console.log(result)
                if (result) {
                    //Chama a função para receber o ID gerado no Banco de Dados
                    let lastIdPersonagem = await personagemDAO.getSelectLastIdCharacter()
                    console.log(lastIdPersonagem)
                    if (lastIdPersonagem) {
                        personagem.id = lastIdPersonagem

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = personagem

                        return MESSAGE.HEADER //201
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }


    } catch (error) {

        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }

}


//Atualiza um personagem
const atualizarPersonagem = async function (personagem, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosPersonagem(personagem)

            if (!validarDados) {

                let validarID = await buscarPersonagemId(id)

                if (validarID.status_code == 200) {

                    personagem.id = parseInt(id)

                    let result = await personagemDAO.setUpdateCharacters(personagem)

                    if (result) {
                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = personagem

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID // (400 ou 404 ou 500)
                }
            } else {
                return validarDados // retorno da função de validar dados 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}


//Apaga um personagem
const excluirPersonagem = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarPaisId(id)

        if (validarID.status_code == 200) {

            let result = await personagemDAO.setDeleteCharacters(id)

            if (result) {
                MESSAGE.HEADER.status       = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message      = MESSAGE.SUCCESS_DELETED_ITEM.message //200

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
            }

        } else {
            return validarID
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

// Validação de dados dos personagens
const validarDadosPersonagem = async function (personagem) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (personagem.nome == '' || personagem.nome == null || personagem.nome == undefined || personagem.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (personagem.genero.length > 20 || personagem.nome == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (personagem.idade == undefined ) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IDADE] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else {
        return false
    }
}



module.exports = {
    listarPaises,
    buscarPaisId,
    inserirPais,
    atualizarPais,
    excluirPais
}