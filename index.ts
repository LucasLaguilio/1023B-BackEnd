import mysql, { Connection, ConnectionOptions , QueryError } from 'mysql2/promise';
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'

const app = fastify()
app.register(cors)

app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.send("Fastify Funcionando!")
})
app.get("/estudantes", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'banco1023b',
            port: 3306
        });
        const resultado = await conn.query("SELECT * FROM estudantes")
        const [dados,estruturaTabela] = resultado
        reply.status(200).send(dados)
        
    } catch (erro:any) {
        if (erro.code === "ECONNREFUSED") {
            console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!")
            reply.status(400).send({mensagem:"ERRO: LIGUE O LARAGÃO!!! CABEÇA!"})	
        } else if (erro.code === "ER_BAD_DB_ERROR") {
            console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO")
        } else if (erro.code === "ER_ACCESS_DENIED_ERROR") {
            console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO")
        } else {
            console.log(erro)
            reply.send({mensagem:"ERRO DESCONHECIDO"})
        }   
    }
})
app.listen({ port: 8000 }, (erro, endereco) => {
    if (erro) {
        console.log("ERRO: Fastify não iniciou")
    }
    console.log(`Fastify iniciado na porta: ${endereco}`)
})  
