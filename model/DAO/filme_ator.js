/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de filme e ator no Banco de Dados MySQL
 * Data: 12/11/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/



const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do Prisma para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna uma lista de todos os filmes e atores no banco de dados
const getSelectAllFilmsActors = async function () {
    try {
        // SQL
        let sql = `select * from tbl_filme_ator order by id desc`

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

//Retorna um FilmeAtor filtrando pelo id do banco de dados
const getSelectByIdFilmsActors = async function (id) {

    try {
        //Script SQL
        let sql = `select * from tbl_filme_ator where id = ${id}`

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

//Retorna os atores filtrando pelo id do filme do banco de dados
const getSelectActorsByIdFilm = async function (idFilme) {

    try {
        //Script SQL
        let sql = `select tbl_ator.ator_id, tbl_ator.nome
                    from tbl_filme
                             inner join tbl_filme_ator
                                 on tbl_filme.id = tbl_filme_ator.id_filme
                             inner join tbl_ator
                                    on tbl_ator.ator_id  = tbl_filme_ator.id_ator
                    where tbl_filme.id = ${idFilme}`

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

//Retorna os filmes filtrando pelo id do ator do banco de dados
const getSelectFilmsByIdActors = async function (idFilme) {

    try {
        //Script SQL
        let sql = `select tbl_ator.id, tbl_ator.nome
                    from tbl_filme
                             inner join tbl_filme_ator
                                 on tbl_filme.id = tbl_filme_ator.id_filme
                             inner join tbl_ator
                                    on tbl_ator.ator_id  = tbl_filme_ator.id_ator 
                    where tbl_filme.id = ${idAtor}`

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

//Retorna o último Filme ator adicionado
const getSelectLastId = async function () {
    try {
        let sql = `select id from tbl_filme_ator order by id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false
    } catch (error) {

        return false
    }

}

//Insere um filme ator no Banco de Dados
const setInsertFilmsActors = async function (filmeAtor) {
    try {
        let sql = `insert into tbl_filme_ator (id_filme, id_ator)
        values(${filmeAtor.id_filme}, ${filmeAtor.id_ator})`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {

        return false
    }

}

//Atualiza um filme ator existente no Banco de Dados
const setUpdateFilmsActors = async function (filmeAtor) {
    try {
        let sql = `update tbl_filme_ator set
        id_filme        =  ${filmeAtor.id_filme},
        id_ator       =  ${filmeAtor.id_ator}
        where id        =  ${filmeAtor.id}`

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

//Apaga um filme e ator existente no Banco de Dados filtrando pelo id
const setDeleteFilmsActors = async function (id) {

    try {
        let sql = `delete from tbl_filme_ator where id = ${id}`

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
    getSelectAllFilmsActors,
    getSelectByIdFilmsActors,
    getSelectFilmsByIdActors,
    getSelectLastId,
    getSelectActorsByIdFilm,
    setInsertFilmsActors,
    setUpdateFilmsActors,
    setDeleteFilmsActors
}