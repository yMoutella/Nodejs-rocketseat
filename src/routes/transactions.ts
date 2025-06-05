import { FastifyInstance } from "fastify";
import { z } from "zod";
import { connection } from "../database";
import { randomUUID } from "crypto";
import { checkSessionId } from "../middlewares/middleware";

export async function transactionsRoutes(app: FastifyInstance) {

    app.post('/', async (req, res) => {

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body)

        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()
        }

        res.cookie('sessionId', sessionId), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days - measurement in seconds
        }


        await connection('transactions')
            .insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
                session_id: sessionId
            })

        res.status(201).send({ message: 'success', data: { title, amount, type } })

    })

    app.get('/', {
        preHandler: [checkSessionId]
    }, async (req, res) => {

        const { sessionId } = req.cookies

        const transactions = await connection('transactions').select().where({
            session_id: sessionId
        })
        res.status(200).send({
            transactions
        })
    })

    app.get('/:id', {
        preHandler: [checkSessionId]
    }, async (req, res) => {
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { sessionId } = req.cookies

        const { id } = getTransactionsParamsSchema.parse(req.params)
        const transactions = await connection('transactions')
            .where({
                id,
                session_id: sessionId
            })
            .first()

        res.status(200).send({
            transactions
        })
    })

    app.get('/summary', {
        preHandler: [checkSessionId]
    }, async (req, res) => {

        const { sessionId } = req.cookies

        const sum = await connection('transactions')
            .where({
                session_id: sessionId
            })
            .sum('amount', { as: 'amount' })
            .first()

        return sum
    })

}
