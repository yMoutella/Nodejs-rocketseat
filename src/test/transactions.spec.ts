import { afterAll, beforeAll, expect, it, test } from 'vitest';
import supertest from "supertest";
import { app } from '../app'
import { beforeEach, describe } from 'node:test';
import { execSync } from 'node:child_process';

describe('Transactions Routes', async () => {

    beforeAll(async () => {
        await app.ready()
    })

    beforeEach(() => {
        execSync('yarn knex migrate:rollback --all')
        execSync('yarn knex migrate:latest')
    })
    afterAll(async () => {
        await app.close()
    })

    it('User can create a new transaction', async () => {
        await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'Test Transaction',
                amount: 100,
                type: 'credit',
            })
            .expect(201)

    })

    it('User can get all transactions', async () => {
        const createTransactionResponse = await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'Test Transaction',
                amount: 100,
                type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')!

        const listTransactionsResponse = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        expect(listTransactionsResponse.body).toEqual(
            expect.objectContaining({
                transactions: expect.arrayContaining([
                    expect.objectContaining({
                        title: expect.any(String),
                        amount: 100,
                        session_id: expect.any(String),
                        created_at: expect.any(String),
                        id: expect.any(String)
                    })
                ])
            })
        )
    })
    it('User can get transaction from id', async () => {
        const createTransactionResponse = await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'Test Transaction',
                amount: 100,
                type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')!
        const { id } = createTransactionResponse.body.data

        const transactionByIdResponse = await supertest(app.server)
            .get('/transactions/' + id)
            .set('Cookie', cookies)
            .expect(200)

        expect(transactionByIdResponse.body).toEqual(
            expect.objectContaining({
                transaction: expect.objectContaining({
                    title: expect.any(String),
                    amount: expect.any(Number),
                    session_id: expect.any(String),
                    created_at: expect.any(String),
                    id: expect.any(String)
                })
            })
        )
    })


})

