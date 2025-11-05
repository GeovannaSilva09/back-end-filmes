/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de relacionamento entre filme e gênero no Banco de Dados MySQL
 * Data: 05/11/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/

// Import da biblioteca do PrismaClient

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do Prisma para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna uma lista de todos od filmes e generos no banco de dados
const getSelectAllFilmsGenres = async function () {
    try {
        // SQL
        let sql = `select * from tbl_filme_genero order by id desc`

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

//Retorna um FilmeGênero filtrando pelo id do banco de dados
const getSelectByIdFilmGenre = async function (id) {

    try {
        //Script SQL
        let sql = `select * from tbl_filme_genero where id = ${id}`

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

//Retorna os generos filtrando pelo id do filme do banco de dados
const getSelectGenresByIdFilm = async function (idFilme) {

    try {
        //Script SQL
        let sql = `select tbl_genero.genero_id, tbl_genero.nome
                    from tbl_filme
                             inner join tbl_filme_genero
                                 on tbl_filme.id = tbl_filme_genero.id_filme
                             inner join tbl_genero
                                    on tbl_genero.genero_id  = tbl_filme_genero.id_genero 
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

//Retorna os filmes filtrando pelo id do genero do banco de dados
const getSelectFilmsByIdGenres = async function (idFilme) {

    try {
        //Script SQL
        let sql = `select tbl_filme.id, tbl_filme.nome
                    from tbl_filme
                             inner join tbl_filme_genero
                                 on tbl_filme.id = tbl_filme_genero.id_filme
                             inner join tbl_genero
                                    on tbl_genero.genero_id  = tbl_filme_genero.id_genero 
                    where tbl_genero.genero_id = ${idGenero}`

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

//Retorna o último FilmeGênero adicionado
const getSelectLastId = async function () {
    try {
        let sql = `select id from tbl_filme_genero order by id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false
    } catch (error) {

        return false
    }

}

//Insere um filmeGênero no Banco de Dados
const setInsertFilmsGenres = async function (filmeGenero) {
    try {
        let sql = `insert into tbl_filme_genero (id_filme, id_genero)
        values(${filmeGenero.id_filme}, ${filmeGenero.id_genero})`

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
const setUpdateFilmsGenres = async function (filmeGenero) {
    try {
        let sql = `update tbl_filme_genero set
        id_filme        =  ${filmeGenero.id_filme},
        id_genero       =  ${filmeGenero.id_genero}
        where id        =  ${filmeGenero.id}`

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

//Apaga um filmeGenero existente no Banco de Dados filtrando pelo id
const setDeleteFilmsGenres = async function (id) {

    try {
        let sql = `delete from tbl_filme_genero where id = ${id}`

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
    getSelectAllFilmsGenres,
    getSelectByIdFilmGenre,
    getSelectLastId,
    getSelectFilmsByIdGenres,
    getSelectGenresByIdFilm,
    setInsertFilmsGenres,
    setUpdateFilmsGenres,
    setDeleteFilmsGenres
}