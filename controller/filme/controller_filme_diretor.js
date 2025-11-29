/******************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *                 para o CRUD de filme e diretor
 *              (Validações, tratamentos de dados, tratamento de erros, etc)
 * Data: 29/11/2025
 * Autora: Geovanna
 * versão: 1.0
 *****************************************************************************************************/

//Import do arquivo DAO do Filme Diretor
//const { response } = require('express')
const filmeDiretorDAO = require('../../model/DAO/filme_diretor.js')

//Import do arquivo de mensagens
const MESSAGE_DEFAULT = require('../modulo/config.messages.js')

//Retorna a lista de filmesDiretor
const listarFilmesDiretor = async function () {

    //Realizando cópia do objeto MESSAGE_DEFAULT, para que as alterações
    // dessa função não interfira em outras funções

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        // Chama a função do DAO para retornar a lista de diretores
        let resultFilmesDiretores = await filmeDiretorDAO.getSelectAllFilmsDirectors()

        if (resultFilmesDiretores) {

            if (resultFilmesDiretores.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.filmes_diretores = resultFilmesDiretores

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


//Retorna um filme diretor pelo id 
const buscarFilmeDiretorId = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let resultFilmesDiretores = await filmeDiretorDAO.getSelectByIdFilmsDirectors(parseInt(id))


            if (resultFilmesDiretores) {
                if (resultFilmesDiretores.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_REQUEST.message
                    MESSAGE.HEADER.response.film_director = result
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

//Retorna os filmes filtrando pelo id dos diretores
const listarFilmesIdDiretor = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (idDiretor != '' && idDiretor != null && idDiretor != undefined && !isNaN(id) && idDiretor > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmeDiretorDAO.getSelectFilmsByIdDirectors(parseInt(idDiretor))


            if (resultFilmesDiretores) {
                if (resultFilmesDiretores.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_REQUEST.message
                    MESSAGE.HEADER.response.film_director = result
                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404    
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_DIRETOR] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}


//Retorna os diretores filtrando pelo id do filme
const listarDiretoresIdFilme = async function (idFilme) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmeDiretorDAO.getSelectDirectorsByIdFilm(parseInt(idFilme))


            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status               = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code          = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.message              = MESSAGE.SUCCESS_REQUEST.message
                    MESSAGE.HEADER.response.film_director  = result
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

//Insere um novo filme diretor
const inserirFilmeDiretor = async function (filmeDiretor, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeDiretor(filmeDiretor)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme diretor
                let result = await filmeDiretorDAO.setInsertFilmsDirectors(filmeDiretor, contentType)
                console.log(result)

                if (result) {

                    //Chama a função para receber o ID gerado no Banco de Dados
                    let lastIdFilmDirector = await filmeDiretorDAO.getSelectLastId()

                    console.log(lastIdFilmDirector)
                    if (lastIdFilmDirector) {

                        filmeDiretor.id                  = lastIdFilmDiretor

                        MESSAGE.HEADER.status           = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code      = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message          = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response         = filmeDiretor
                      

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

//Atualiza um filme diretor
const atualizarFilmeDiretor = async function (filmeDiretor, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosFilmeDiretor(filmeDiretor)

            if (!validarDados) {

                let validarID = await buscarFilmeDiretorId(id)

                if (validarID.status_code == 200) {

                    filmeDiretor.id = parseInt(id)

                    let result = await filmeDiretorDAO.setUpdateFilmsDirectors(filmeDiretor)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmeDiretor

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID // Retorno da função BuscarGeneroID (400 ou 404 ou 500)
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

//Apaga um filme diretor
const excluirFilmeDiretor = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarFilmeDiretorId(id)

        if (validarID.status_code == 200) {

            let result = await filmeDiretorDAO.setDeleteFilmsDirectors(Number(id))

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

// Validação de dados dos filmeS diretor
const validarDadosFilmeDiretor = async function (filmeDiretor) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmeDiretor.id_filme == '' || filmeDiretor.id_filme == null || filmeDiretor.id_filme == undefined || isNaN(filmeDiretor.id_filme) || filmeDiretor.id_filme <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido!!!' //400
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (filmeDiretor.id_diretor == '' || filmeDiretor.id_diretor == null || filmeDiretor.id_diretor == undefined || isNaN(filmeDiretor.id_diretor) || filmeDiretor.id_diretor <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_DIRETOR] inválido!!!' //400
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }else {
        return false
    }
}



module.exports = {
    listarFilmesDiretor,
    listarFilmesIdDiretor,
    listarDiretoresIdFilme,
    buscarFilmeDiretorId,
    inserirFilmeDiretor,
    atualizarFilmeDiretor,
    excluirFilmeDiretor
}