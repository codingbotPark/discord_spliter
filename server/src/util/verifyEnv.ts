import {z, ZodObject} from 'zod'
import 'dotenv/config'

/** @TODO narrowing valid range(ex length)*/
const zodObject = {
    PORT: z.number().optional().default(3000),
    APP_ID: z.string(),
    DISCORD_TOKEN: z.string(),
    PUBLIC_KEY: z.string()
}
type ZodSchemaType = ZodObject<typeof zodObject>;


export const envSchema = z.object(zodObject);

export function verifyEnv(envSchema:ZodSchemaType){

    const envServer = envSchema.safeParse({
        PORT:process.env.PORT,
        APP_ID:process.env.APP_ID,
        DISCORD_TOKEN:process.env.DISCORD_TOKEN,
        PUBLIC_KEY:process.env.PUBLIC_KEY
    })
    if (envServer.error){
        // logging env setting error
        return
    }
    
    // data = schema for env
    const envServerSchema = envServer.data
    return envServerSchema
}







