import { Knex } from 'knex'
import knex from 'knex'
import { env } from './env'


export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        directory: './db/migrations',
        extension: 'ts'
    }
}

export const connection = knex(config)