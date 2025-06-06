import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' })
    process.env.DATABASE_URL = './db/test.db'
}
else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.log(`Error in environment variables! \n ${_env.error.format()}`)
    throw new Error(`Error in environment variables! \n ${_env.error.format()}`)
}

export const env = _env.data
