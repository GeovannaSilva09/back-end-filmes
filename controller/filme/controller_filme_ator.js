/******************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *                 para o CRUD de filme e ator
 *              (Validações, tratamentos de dados, tratamento de erros, etc)
 * Data: 29/11/2025
 * Autora: Geovanna
 * versão: 1.0
 *****************************************************************************************************/

//Import do arquivo DAO do Filme ator
//const { response } = require('express')
const filmeAtorDAO = require('../../model/DAO/filme_ator.js')

//Import do arquivo de mensagens
const MESSAGE_DEFAULT = require('../modulo/config.messages.js')

//Retorna a lista de filmesAtor
const listarFilmesAtor = async function () {

    //Realizando cópia do objeto MESSAGE_DEFAULT, para que as alterações
    // dessa função não interfira em outras funções

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        // Chama a função do DAO para retornar a lista de atores
        let resultFilmesAtores = await filmeAtorDAO.getSelectAllFilmsActors()

        if (resultFilmesAtores) {

            if (resultFilmesAtores.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.filmes_atores = resultFilmesAtores

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


//Retorna um filme ator pelo id 
const buscarFilmeAtorId = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let resultFilmesAtores = await filmeAtorDAO.getSelectByIdFilmsActors(parseInt(id))


            if (resultFilmesAtores) {
                if (resultFilmesAtores.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_REQUEST.message
                    MESSAGE.HEADER.response.film_actor = result
                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404    
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Retorna os filmes filtrando pelo id dos atores
const listarFilmesIdAtor = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (idAtor != '' && idAtor != null && idAtor != undefined && !isNaN(id) && idAtor > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmeAtorDAO.getSelectFilmsByIdActors(parseInt(idAtor))


            if (resultFilmesAtores) {
                if (resultFilmesAtores.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_REQUEST.message
                    MESSAGE.HEADER.response.film_actor = result
                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404    
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ATOR] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}


//Retorna os atores filtrando pelo id do filme
const listarAtoresIdFilme = async function (idFilme) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmeAtorDAO.getSelectActorsByIdFilm(parseInt(idFilme))


            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status               = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code          = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.message              = MESSAGE.SUCCESS_REQUEST.message
                    MESSAGE.HEADER.response.film_actor  = result
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
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Insere um novo filme ator
const inserirFilmeAtor = async function (filmeAtor, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeAtor(filmeAtor)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme ator
                let result = await filmeAtorDAO.setInsertFilmsActors(filmeAtor, contentType)
                console.log(result)

                if (result) {

                    //Chama a função para receber o ID gerado no Banco de Dados
                    let lastIdFilmActor = await filmeAtorDAO.getSelectLastId()

                    console.log(lastIdFilmActor)
                    if (lastIdFilmActor) {

                        filmeAtor.id                  = lastIdFilmAtor

                        MESSAGE.HEADER.status           = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code      = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message          = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response         = filmeAtor
                      

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
console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }

}

//Atualiza um filme Ator
const atualizarFilmeAtor = async function (filmeAtor, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosFilmeAtor(filmeAtor)

            if (!validarDados) {

                let validarID = await buscarFilmeAtorId(id)

                if (validarID.status_code == 200) {

                    filmeAtor.id = parseInt(id)

                    let result = await filmeAtorDAO.setUpdateFilmsActors(filmeAtor)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmeAtor

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID // Retorno da função BuscarFilmeAtorID (400 ou 404 ou 500)
                }
            } else {
                return validarDados // retorno da função de validar dados 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {

        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Apaga um filme ator
const excluirFilmeAtor = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarFilmeAtorId(id)

        if (validarID.status_code == 200) {

            let result = await filmeAtorDAO.setDeleteFilmsActors(Number(id))

            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message //200
               

                delete MESSAGE.HEADER.response
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

// Validação de dados dos filmes ator
const validarDadosFilmeAtor = async function (filmeAtor) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmeAtor.id_filme == '' || filmeAtor.id_filme == null || filmeAtor.id_filme == undefined || isNaN(filmeAtor.id_filme) || filmeAtor.id_filme <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido!!!' //400
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (filmeAtor.id_ator == '' || filmeAtor.id_ator == null || filmeAtor.id_Ator == undefined || isNaN(filmeAtor.id_ator) || filmeAtor.id_ator <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ATOR] inválido!!!' //400
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }else {
        return false
    }
}



module.exports = {
    listarFilmesAtor,
    listarFilmesIdAtor,
    listarAtoresIdFilme,
    buscarFilmeAtorId,
    inserirFilmeAtor,
    atualizarFilmeAtor,
    excluirFilmeAtor

}