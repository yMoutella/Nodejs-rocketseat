import { expect, it, test } from 'vitest';
import supertest from "supertest";
import { app } from '../server';
import { describe } from 'node:test';

describe('Transactions Routes', async () => {

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

        await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)
    })

})

