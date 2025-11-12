/******************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamentos de dados, tratamento de erros, etc)
 * Data: 12/11/2025
 * Autora: Geovanna
 * versão: 1.0
 *****************************************************************************************************/
//Import do arquivo DAO para manipular o CRUD no BD
const diretorDAO = require('../../model/DAO/diretor.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config.messages.js')

//Retorna uma lista de diretores
const listarDiretores = async function () {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de filmes
        let result = await diretorDAO.getSelectAllDirectors()

        if (result) {
            if (result.length > 0) {

                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.diretor = result

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

//Retorna um diretor filtrando pelo ID
const buscarDiretorId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await diretorDAO.getSelectByIdDirector(parseInt(id))

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
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Insere um novo diretor
const inserirDiretor = async function (diretor, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosDiretor(diretor)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme
                let result = await diretorDAO.setInsertDirectors(diretor, contentType)

                if (result) {

                    //Chama a função para receber o ID gerado no Banco de Dados
                    let lastIdDiretor = await diretorDAO.getSelectLastIdDirector()



                    if (lastIdDiretor) {

                        //Adiciona no JSON de filme o ID que foi gerado no BD
                        diretor.id = lastIdDiretor

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message


                        MESSAGE.HEADER.response = diretor


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

//Atualiza um diretor filtrando pelo ID
const atualizarDiretor = async function (diretor, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosDiretor(diretor)

            if (!validarDados) {

                //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
                let validarID = await buscarDiretorId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200  
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do filme
                    diretor.id = parseInt(id)

                    //Chama a função do DAO para atualizar um filme
                    let result = await diretorDAO.setUpdateDirectors(diretor)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = diretor

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //retorno da função de buscarFilmeID (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do filme 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Apaga um diretor filtrando pelo ID
const excluirDiretor = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
        let validarID = await buscarDiretorId(id)

        //Verifica se o ID existe no BD, caso exista teremos o status 200  
        if (validarID.status_code == 200) {

            //Chama a função do DAO para deletar um filme
            let result = await diretorDAO.setDeleteDirectors(id)

            if (result) {
                MESSAGE.HEADER.status       = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message      = MESSAGE.SUCCESS_DELETED_ITEM.message //200

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return validarID //retorno da função de buscarFilmeID (400 ou 404 ou 500)
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados do cadastro do diretor
const validarDadosDiretor = async function (diretor) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (diretor.nome == '' || diretor.nome == null || diretor.nome == undefined || diretor.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else if (diretor.data_nascimento == '' || diretor.data_nascimento == null || diretor.data_nascimento == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA_NASCIMENTO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else {
        return false
    }

}

module.exports = {
    listarDiretores,
    buscarDiretorId,
    inserirDiretor,
    atualizarDiretor,
    excluirDiretor
}


