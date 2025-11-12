/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de filme e diretor no Banco de Dados MySQL
 * Data: 12/11/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/

// Import da biblioteca do PrismaClient

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do Prisma para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna uma lista de todos os filmes e diretores no banco de dados
const getSelectAllFilmsDirectors = async function () {
    try {
        // SQL
        let sql = `select * from tbl_filme_diretor order by id desc`

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

//Retorna um FilmeDiretor filtrando pelo id do banco de dados
const getSelectByIdFilmsDirectors = async function (id) {

    try {
        //Script SQL
        let sql = `select * from tbl_filme_diretor where id = ${id}`

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

//Retorna os diretores filtrando pelo id do filme do banco de dados
const getSelectDirectorsByIdFilm = async function (idFilme) {

    try {
        //Script SQL
        let sql = `select tbl_diretor.diretor_id, tbl_diretor.nome
                    from tbl_filme
                             inner join tbl_filme_diretor
                                 on tbl_filme.id = tbl_filme_diretor.id_filme
                             inner join tbl_diretor
                                    on tbl_diretor.diretor_id  = tbl_filme_diretor.id_diretor
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

//Retorna os filmes filtrando pelo id do diretor do banco de dados
const getSelectFilmsByIdDirectors = async function (idFilme) {

    try {
        //Script SQL
        let sql = `select tbl_diretor.id, tbl_diretor.nome
                    from tbl_filme
                             inner join tbl_filme_diretor
                                 on tbl_filme.id = tbl_filme_diretor.id_filme
                             inner join tbl_diretor
                                    on tbl_diretor.diretor_id  = tbl_filme_diretor.id_diretor 
                    where tbl_filme.id = ${idDiretor}`

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

//Retorna o último Filme Diretor adicionado
const getSelectLastId = async function () {
    try {
        let sql = `select id from tbl_filme_diretor order by id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false
    } catch (error) {

        return false
    }

}

//Insere um filme diretor no Banco de Dados
const setInsertFilmsDirectors = async function (filmeDiretor) {
    try {
        let sql = `insert into tbl_filme_diretor (id_filme, id_genero)
        values(${filmeDiretor.id_filme}, ${filmeDiretor.id_diretor})`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {

        return false
    }

}

//Atualiza um filmeGênero existente no Banco de Dados
const setUpdateFilmsDirectors = async function (filmeDiretor) {
    try {
        let sql = `update tbl_filme_diretor set
        id_filme        =  ${filmeDiretor.id_filme},
        id_Diretor       =  ${filmeDiretor.id_diretor}
        where id        =  ${filmeDiretor.id}`

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

//Apaga um filme e diretor existente no Banco de Dados filtrando pelo id
const setDeleteFilmsDirectors = async function (id) {

    try {
        let sql = `delete from tbl_filme_diretor where id = ${id}`

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
    getSelectAllFilmsDirectors,
    getSelectByIdFilmsDirectors,
    getSelectLastId,
    getSelectByIdFilmsDirectors,
    getSelectDirectorsByIdFilm,
    setInsertFilmsDirectors,
    setUpdateFilmsDirectors,
    setDeleteFilmsDirectors
}