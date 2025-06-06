import { kStringMaxLength } from 'buffer'
import { Knex } from 'knex'
import { StringMappingType } from 'typescript'

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string,
            session_id: string,
            title: string,
            created_at: string,
            amount: number
        }
    }
}