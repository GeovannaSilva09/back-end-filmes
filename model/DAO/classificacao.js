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



//Retorna todos os filmes do banco de dados
const  getSelectall= async function () {
    try {
        //script SQL    
        let sql = `select * from tbl_filme order by id desc`

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

//Retorna um filme filtrando pelo ID do banco de dados
const getSelectByIdFilms = async function (id) {
    try {
        //script SQL    
        let sql = `select * from tbl_filme where id=${id}`

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

//Retorna o último filme adicionado 
const getSelectLastIdFilm = async function () {
    try {
        //script SQL    
        let sql = `select id from tbl_filme order by id desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retono do banco é um ARRAY (vazio ou com dados)
        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false

    } catch (error) {
        //console.log(error)
        return false
    }
}

//Insere um filme existente no banco de dados
const setInsertFilms = async function (filme) {
    try {
        let sql = `INSERT INTO tbl_filme (nome,
            sinopse, 
            data_lancamento, 
            duracao, 
            orcamento,
            trailer,
            capa) 
        values('${filme.nome}',
               '${filme.sinopse}',
               '${filme.data_lancamento}',
               '${filme.duracao}',
               '${filme.orcamento}',
               '${filme.trailer}',
               '${filme.capa}')`

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

//Atualiza um filme existente no banco de dados filtrando pelo ID
const setUpdateFilms = async function (filme) {

    try {
        let sql = `update tbl_filme set
            nome                    =      '${filme.nome}',
            sinopse                 =      '${filme.sinopse}',
            data_lancamento         =      '${filme.data_lancamento}',
            duracao                 =      '${filme.duracao}',
            orcamento               =      '${filme.orcamento}',
            trailer                 =      '${filme.trailer}',
            capa                    =      '${filme.capa}'
            where id = ${filme.id}`



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

//Apaga um filme existente no banco de dados filtrando pelo ID
const setDeleteFilms = async function (id) {
    try {
        let sql = `delete from tbl_filme where id = ${id}`

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
