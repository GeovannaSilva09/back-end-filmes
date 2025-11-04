/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de Países no Banco de Dados MySQL
 * Data: 04/11/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/

// Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do Prisma para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os paises
const getSelectAllCountries = async function () {
    try {
        // SQL
        let sql = `select * from tbl_pais order by pais_id desc`

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

//Retorna um pais filtrando pelo id
const getSelectByIdCountries = async function (id) {

    try {
        //Script SQL
        let sql = `select * from tbl_pais where pais_id = ${id}`

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

//Retorna o último pais adicionado
const getSelectLastIdCountry = async function () {
    try {
        let sql = `select pais_id from tbl_pais order by pais_id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].pais_id)
        else
            return false
    } catch (error) {

        return false
    }

}

//Insere um pais no Banco de Dados
const setInsertCountries = async function (pais) {
    try {
        let sql = `insert into tbl_pais (nome, sigla)
        values('${pais.nome}',
              '${pais.sigla}'
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

//Atualiza um país existente no Banco de Dados
const setUpdateCountries = async function (pais) {
    try {
        let sql = `update tbl_pais set
        nome                =  '${pais.nome}',
        sigla               =  '${pais.sigla}'
        where pais_id       =   ${pais.id}`

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

//Apaga um país existente no Banco de Dados filtrando pelo id
const setDeleteCountries = async function (id) {

    try {
        let sql = `delete from tbl_pais where pais_id = ${id}`

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
getSelectAllCountries,
getSelectByIdCountries,
getSelectLastIdCountry,
setInsertCountries,
setUpdateCountries,
setDeleteCountries

}