/************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de Personagens no Banco de Dados MySQL
 * Data: 04/11/2025
 * Autor: Geovanna
 * Versão: 1.0
 ************************************************************************************************/

// Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do Prisma para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os paises
const getSelectAllCharacters = async function () {
    try {
        // SQL
        let sql = `select * from tbl_personagem order by personagem_id desc`

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
const getSelectByIdCharacters = async function (id) {

    try {
        //Script SQL
        let sql = `select * from tbl_personagem where personagem_id = ${id}`

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
const getSelectLastIdCharacter = async function () {
    try {
        let sql = `select personagem_id from tbl_personagem order by personagem_id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].personagem_id)
        else
            return false
    } catch (error) {

        return false
    }

}

//Insere um personagem no Banco de Dados
const setInsertCharacters = async function (personagem) {
    console.log(personagem)
    try {
        let sql = `insert into tbl_personagem (nome, genero, idade, imagem)
        values('${personagem.nome}',
              '${personagem.genero}',
              ${personagem.idade},
              '${personagem.imagem}'
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
const setUpdateCharacters = async function (personagem) {
    try {
        let sql = `update tbl_personagem set
        nome                      =  '${personagem.nome}',
        genero                    =  '${personagem.genero}',
        idade                     =  ${personagem.idade},
        imagem                    =  '${personagem.imagem}'
        where personagem_id       =   ${personagem.id}`

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

//Apaga um personagem existente no Banco de Dados filtrando pelo id
const setDeleteCharacters = async function (id) {

    try {
        let sql = `delete from tbl_personagem where personagem_id = ${id}`

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
    getSelectAllCharacters,
    getSelectByIdCharacters,
    getSelectLastIdCharacter,
    setInsertCharacters,
    setUpdateCharacters,
    setDeleteCharacters
}