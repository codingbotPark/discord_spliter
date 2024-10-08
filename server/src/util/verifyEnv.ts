import {z, ZodObject} from 'zod'
import 'dotenv/config'

const defautlPort = 3000

/** @TODO narrowing valid range(ex length)*/
const zodObject = {
    PORT: z.number().optional().default(defautlPort),
    APP_ID: z.string(),
    DISCORD_TOKEN: z.string(),
    PUBLIC_KEY: z.string(),

    GUILD_ID: z.string(),

    CLIENT_ID:z.string(),
    CLIENT_SECRET:z.string(),
    REDIRECT_URI:z.string(),
    INTERACTION_URI:z.string(),

    RIOT_API_KEY:z.string()
}
type ZodSchemaType = ZodObject<typeof zodObject>;

function verifyEnv(envSchema:ZodSchemaType){

    const envServer = envSchema.safeParse({
        PORT:process.env.PORT,
        APP_ID:process.env.APP_ID,
        DISCORD_TOKEN:process.env.DISCORD_TOKEN,
        PUBLIC_KEY:process.env.PUBLIC_KEY,
        GUILD_ID:process.env.GUILD_ID,

        CLIENT_ID:process.env.CLIENT_ID,
        CLIENT_SECRET:process.env.CLIENT_SECRET,
        REDIRECT_URI:process.env.REDIRECT_URI,
        INTERACTION_URI:process.env.INTERACTION_URI,

        RIOT_API_KEY:process.env.RIOT_API_KEY
    })
    if (envServer.error){
        // logging env setting error
        throw new Error(`Environment validation error: ${envServer.error}`);
    }
    
    // data = schema for env
    const envServerSchema = envServer.data
    return envServerSchema
}

export const envSchema = z.object(zodObject);
export const verifiedEnv = verifyEnv(envSchema)






