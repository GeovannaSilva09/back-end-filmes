/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de gêneros no Banco de Dados MySQL
 * Data: 22/10/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/

// Import da biblioteca do PrismaClient
const { sqltag } = require('@prisma/client/runtime/library')
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do Prisma para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os gêneros
const getSelectAllGenres = async function () {
    try {
        // SQL
        let sql = `select * from tbl_genero order by genero_id desc`

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

//Retorna um gênero filtrando pelo id
const getSelectByIdGenres = async function (id) {

    try {
        //Script SQL
        let sql = `select * from tbl_genero where genero_id = ${id}`

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

//Retorna o último gênero adicionado
const getSelectLastIdGenre = async function () {
    try {
        let sql = `select genero_id from tbl_genero order by genero_id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].genero_id)
        else
            return false
    } catch (error) {
    
        return false
    }

}

//Insere um gênero no Banco de Dados
const setInsertGenres = async function (genero) {
    try {
        let sql = `insert into tbl_genero (nome)
        values('${genero.nome}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {

        return false
    }

}

//Atualiza um gênero existente no Banco de Dados
const setUpdateGenres = async function (genero) {
    try {
        let sql = `update tbl_genero set
        nome        =  '${genero.nome}'
        where genero_id    = ${genero.id}`

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

//Apaga um gênero existente no Banco de Dados filtrando pelo id
const setDeleteGenres = async function (id) {

    try {
        let sql = `delete from tbl_genero where genero_id = ${id}`

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
    getSelectAllGenres,
    getSelectByIdGenres,
    getSelectLastIdGenre,
    setInsertGenres,
    setUpdateGenres,
    setDeleteGenres
}