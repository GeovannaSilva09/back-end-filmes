/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de filme no Banco de Dados MySQL
 * Data: 01/10/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/
/**
 *Dependencias do node para banco de Dados Relacional 
 *      Sequelize -> foi uma biblioteca para acesso a banco de dados
 *      Prisma    -> É uma biblioteca atual para acesso e manipulação de dados, utilizando
 *                        SQL ou ORM (MySQL, PostgreSQL, SQLServer, Oracle)
 *      Knex     ->  É uma biblioteca atual para acesso e manipulação de dados, utilizano
 *                        SQL (MySQL)
 * 
 * Dependencia do node para Banco de Dados NÃO Relacional
 *      Mongoose    -> É uma biblioteca para acesso a banco de dados não relacional (MongoDB)
 * 
 * 
 * Instalação do Prisma
 * npm install prisma --save          -> Realiza a conexão com o BD
 * npm install @prisma/client --save  -> Permite executar scripts SQL no BD
 * 
 *   $queryRawUnsafe()   -> Permite executar apenas scripts SQL que retornam
 *          dados do BD (SELECT), permite também executar um script SQL através 
 *          de uma variável
 * 
 *   $executeRawUnsafe()   -> Permite executar scripts SQL que NÃO retornam dados
 *          do BD (INSERT, UPDATE, DELETE)
 * 
 *   $queryRaw()   -> Permite executar apenas scripts SQL que retornam
 *          dados do BD (SELECT), permite APENAS executar um script SQL direto
 *          no método. Permite também aplicar segurança contra SQL injection
 * 
 *   $executeRaw()   -> Permite executar scripts SQL que NÃO retornam dados
 *          do BD (INSERT, UPDATE, DELETE), permite APENAS executar um script
 *         SQL direto no método. Permite também aplicar segurança contra SQL injection
 */

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('@prisma/client')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes do banco de dados
const getSelectallFilms = async function () {
    try {
        //script SQL    
        let sql = `select * from tbl_filme order by id desc`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnSafe(sql)

        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }


}

//Retorna um filme filtrando pelo ID do banco de dados
const getSelectByIdFilms = async function (id) {

}

//Insere um filme existente no banco de dados
const setInsertFilms = async function (filme) {

}

//Atualiza um filme existente no banco de dados filtrando pelo ID
const setUpdateFilms = async function (filme) {

}

//Apaga um filme existente no banco de dados filtrando pelo ID
const setDeleteFilms = async function (id) {

}

module.exports = {
    getSelectallFilms
}