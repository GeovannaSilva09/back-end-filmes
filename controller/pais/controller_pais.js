/******************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamentos de dados, tratamento de erros, etc)
 * Data: 04/11/2025
 * Autora: Geovanna
 * versão: 1.0
 *****************************************************************************************************/

//Import do arquivo DAO
const paisDAO = require('../../model/DAO/pais.js')

//Import do arquivo de mensagens
const MESSAGE_DEFAULT = require('../modulo/config.messages.js')

//Retorna a lista de paises
const listarPaises = async function () {

    //Realizando cópia do objeto MESSAGE_DEFAULT, para que as alterações
    // dessa função não interfira em outras funções

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        // Chama a função do DAO para retornar a lista 
        let result = await paisDAO.getSelectAllCountries()
        if (result) {

            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.pais = result

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




//Retorna pais pelo id
const buscarPaisId = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await paisDAO.getSelectByIdCountries(parseInt(id))


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
const inserirPais = async function (pais, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosPais(pais)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo pais
                let result = await paisDAO.setInsertCountries(pais, contentType)
                console.log(result)
                if (result) {
                    //Chama a função para receber o ID gerado no Banco de Dados
                    let lastIdPais = await paisDAO.getSelectLastIdCountry()
                    console.log(lastIdPais)
                    if (lastIdPais) {
                        pais.id = lastIdPais

                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = pais

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


//Atualiza um país
const atualizarPais = async function (pais, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosPais(pais)

            if (!validarDados) {

                let validarID = await buscarPaisId(id)

                if (validarID.status_code == 200) {

                    pais.id = parseInt(id)

                    let result = await paisDAO.setUpdateCountries(pais)

                    if (result) {
                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = pais

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


//Apaga um pais
const excluirPais = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarPaisId(id)

        if (validarID.status_code == 200) {

            let result = await paisDAO.setDeleteCountries(id)

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

// Validação de dados dos países
const validarDadosPais = async function (pais) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (pais.nome == '' || pais.nome == null || pais.nome == undefined || pais.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else if (pais.sigla == '' || pais.sigla == null || pais.sigla == undefined || pais.sigla.length > 3) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SIGLA] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else {
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