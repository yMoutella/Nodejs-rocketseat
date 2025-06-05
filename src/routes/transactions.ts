import { FastifyInstance } from "fastify";
import { z } from "zod";
import { connection } from "../database";
import { randomUUID } from "crypto";

export async function transactionsRoutes(app: FastifyInstance) {

    app.post('/', async (req, res) => {

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body)
        await connection('transactions')
            .insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
            })

        res.status(201).send({ message: 'success', data: { title, amount, type } })

    })

    app.get('/:id', async (req, res) => {
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTransactionsParamsSchema.parse(req.params)
        const transactions = await connection('transactions').where('id', id).first()

        res.status(200).send({
            transactions
        })
    })

    app.get('/', async (req, res) => {
        const transactions = await connection('transactions').select()
        res.status(200).send({
            transactions
        })
    })
}