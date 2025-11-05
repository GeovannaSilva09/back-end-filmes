/******************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamentos de dados, tratamento de erros, etc)
 * Data: 04/11/2025
 * Autora: Geovanna
 * versão: 1.0
 *****************************************************************************************************/

//Import do arquivo DAO
const atorDAO = require('../../model/DAO/ator.js')

//Import do arquivo de mensagens
const MESSAGE_DEFAULT = require('../modulo/config.messages.js')

//Retorna a lista de paises
const listarAtores = async function () {

    //Realizando cópia do objeto MESSAGE_DEFAULT, para que as alterações
    // dessa função não interfira em outras funções

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        // Chama a função do DAO para retornar a lista 
        let result = await atorDAO.getSelectAllActors()
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




//Retorna atores pelo id
const buscarAtorId = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await atorDAO.getSelectByIdActors(parseInt(id))


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

//Insere um novo país
const inserirAtor = async function (ator, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosAtor(ator)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo ator
                let result = await atorDAO.setInsertActor(ator, contentType)
                console.log(result)
                if (result) {
                    //Chama a função para receber o ID gerado no Banco de Dados
                    let lastIdAtor = await atorDAO.getSelectLastIdActor()
                    console.log(lastIdAtor)
                    if (lastIdAtor) {
                        ator.id = lastIdAtor

                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = ator

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


//Atualiza um ator
const atualizarAtor = async function (ator, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosAtor(ator)

            if (!validarDados) {

                let validarID = await buscarAtorId(id)

                if (validarID.status_code == 200) {

                    ator.id = parseInt(id)

                    let result = await atorDAO.setUpdateActor(ator)

                    if (result) {
                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = ator

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


//Apaga um ator
const excluirAtor = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarAtorId(id)

        if (validarID.status_code == 200) {

            let result = await atorDAO.setDeleteActor(id)

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

// Validação de dados dos atores
const validarDadosAtor = async function (ator) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (ator.nome == '' || ator.nome == null || ator.nome == undefined || ator.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else if (ator.sigla == '' || ator.sigla == null || ator.sigla == undefined || ator.sigla.length > 3) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SIGLA] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else {
        return false
    }
}



module.exports = {
    listarAtores,
    buscarAtorId,
    inserirAtor,
    atualizarAtor,
    excluirAtor
}