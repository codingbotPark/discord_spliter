declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            PORT: string | undefined;
            APP_ID: string;
            DISCORD_TOKEN: string;
            PUBLIC_KEY: string;
        }
    }
}

export {}