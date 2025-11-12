/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de diretores no Banco de Dados MySQL
 * Data: 05/11/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/

// Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do Prisma para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os diretores
const getSelectAllDirectors = async function () {
    try {
        // SQL
        let sql = `select * from tbl_diretor order by diretor_id desc`

        //Executa o script no Banco de dados
        let result = await prisma.$queryRawUnsafe(sql)

        // Validação para identificar se o retorno do banco é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)) {

            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//Retorna um diretor filtrando pelo id
const getSelectByIdDirector = async function (id) {

    try {
        //Script SQL
        let sql = `select * from tbl_diretor where diretor_id = ${id}`

        //Validação para identificar se o retorno do banco é um ARRAY (vazio ou com dados)
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }

}

//Retorna o último diretor adicionado
const getSelectLastIdDirector = async function () {
    try {
        let sql = `select diretor_id from tbl_diretor order by diretor_id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].diretor_id)
        else
            return false
    } catch (error) {

        return false
    }

}

//Insere um diretor no Banco de Dados
const setInsertDirectors = async function (diretor) {
    try {
        let sql = `insert into tbl_diretor (nome, genero, data_nascimento, imagem)
        values('${diretor.nome}',
              '${diretor.genero}',
              '${diretor.data_nascimento}',
              '${diretor.imagem}'
            )`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {

        return false
    }

}

//Atualiza um diretor existente no Banco de Dados
const setUpdateDirectors = async function (diretor) {
    try {
        let sql = `update tbl_diretor set
        nome                =  '${diretor.nome}',
        genero              =  '${diretor.genero}',
        data_nascimento     =  '${diretor.data_nascimento}',
        imagem              =  '${diretor.imagem}'
        where diretor_id    =   ${diretor.id}`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }


}

//Apaga um diretor existente no Banco de Dados filtrando pelo id
const setDeleteDirectors = async function (id) {

    try {
        let sql = `delete from tbl_diretor where diretor_id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {

        return false
    }

}


module.exports = {

    getSelectAllDirectors,
    getSelectByIdDirector,
    getSelectLastIdDirector,
    setInsertDirectors,
    setUpdateDirectors,
    setDeleteDirectors
}