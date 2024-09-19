import {z} from 'zod'

const envSchema = z.object({
    PORT: z.string().url(),
    APP_ID: z.string().url().trim().optional(),
    DISCORD_TOKEN: z.string().url().optional(),
    PUBLIC_KEY: z.string()
});




