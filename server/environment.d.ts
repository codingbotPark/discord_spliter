

import { z } from "zod";
import { envSchema } from "./src/util/verifyEnv";

type EnvSchemaType = z.infer<typeof envSchema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvSchemaType {}
    }
}

export {}