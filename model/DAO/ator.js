/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de Atores no Banco de Dados MySQL
 * Data: 04/11/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/

// Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do Prisma para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os atores
const getSelectAllActors = async function () {
    try {
        // SQL
        let sql = `select * from tbl_ator order by ator_id desc`

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
const getSelectByIdActors = async function (id) {

    try {
        //Script SQL
        let sql = `select * from tbl_actor where ator_id = ${id}`

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
const getSelectLastIdActor = async function () {
    try {
        let sql = `select ator_id from tbl_ator order by ator_id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].ator_id)
        else
            return false
    } catch (error) {

        return false
    }

}

//Insere um pais no Banco de Dados
const setInsertActor = async function (ator) {
    try {
        let sql = `insert into tbl_ator (nome, genero, idade, imagem)
        values('${ator.nome}',
              '${ator.genero}',
              '${ator.idade}',
              '${ator.imagem}'
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
const setUpdateActor = async function (ator) {
    try {
        let sql = `update tbl_ator set
        nome                =  '${ator.nome}',
        genero              =  '${ator.genero}',
        idade               =  '${ator.idade}',
        imagem              =  '${ator.imagem}'
        where ator_id       =   ${ator.id}`

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
const setDeleteActor  = async function (id) {

    try {
        let sql = `delete from tbl_ator where ator_id = ${id}`

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
    getSelectAllActors,
    getSelectByIdActors,
    getSelectLastIdActor,
    setInsertActor,
    setUpdateActor,
    setDeleteActor
}