import fastify from "fastify";
import { connection } from "./database";
import { randomUUID } from "crypto";
import 'dotenv/config'
import { env } from "./env";

const app = fastify()

app.get('/hello', async () => {
    const transaction = await connection('transactions').insert({
        id: randomUUID(),
        text: 'transação de teste',
        amount: 1000.2
    }, "*")
    return transaction

})


app.listen({
    port: env.PORT
}).then(() => {
    console.log('Server running!')
})