import fastify from "fastify";
import 'dotenv/config'
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";
import fastifyCookie from "@fastify/cookie";

export const app = fastify()

app.register(fastifyCookie)
app.register(transactionsRoutes, {
    prefix: '/transactions'
})

app.listen({
    port: env.PORT
}).then(() => {
    console.log('Server running!')
})