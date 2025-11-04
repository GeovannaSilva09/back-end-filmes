/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de classificações no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/
//Import da biblioteca do PrismaClient
//const { PrismaClient } = require('@prisma/client')

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()



//Retorna todos as classificações do banco de dados
const getSelectallRating = async function () {
    try {
        //script SQL    
        let sql = `select * from tbl_classificacao order by classificacao_id desc`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retono do banco é um ARRAY (vazio ou com dados)
        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        //console.log(error)
        return false
    }


}

//Retorna uma classificação filtrando pelo ID do banco de dados
const getSelectByIdRating = async function (id) {
    try {
        //script SQL    
        let sql = `select * from tbl_classificacao where classificacao_id=${id}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retono do banco é um ARRAY (vazio ou com dados)
        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        //console.log(error)
        return false
    }

}

//Retorna a última classificação adicionada 
const getSelectLastIdRating = async function () {
    try {
        //script SQL    
        let sql = `select classificacao_id from tbl_classificacao order by classificacao_id desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retono do banco é um ARRAY (vazio ou com dados)
        if (Array.isArray(result))
            return Number(result[0].classificacao_id)
        else
            return false

    } catch (error) {
        //console.log(error)
        return false
    }
}

//Insere uma classificação no banco de dados
const setInsertRating = async function (classificacao) {
    console.log(classificacao)
    try {
        let sql = `insert into tbl_classificacao (faixa_etaria, descricao)
        values('${classificacao.faixa_etaria}',
                '${classificacao.descricao}'
        )`

        let result = await prisma.$executeRawUnsafe(sql)
        if (result)
            return true
        else {
            console.log(result)
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }

}

//Atualiza uma classificação existente no banco de dados filtrando pelo ID
const setUpdateRatings = async function (classificacao) {
    try {
        let sql = `update tbl_classificacao set
        faixa_etaria                =  '${classificacao.faixa_etaria}',
        descricao                   =  '${classificacao.descricao}'
        where classificacao_id      =  ${classificacao.id}`

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


//Apaga uma classificação existente no banco de dados filtrando pelo ID
const setDeleteRatings = async function (id) {
    try {
        let sql = `delete from tbl_classificacao where classificacao_id = ${id}`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
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
    getSelectallRating,
    getSelectByIdRating,
    getSelectLastIdRating,
    setInsertRating,
    setUpdateRatings,
    setDeleteRatings
}
