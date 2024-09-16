import 'dotenv/config';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';

// Logger class role = write log
class Logger{
    private logFilePath:string
    
    constructor(){
        this.logFilePath = "../../logs/server.log";
    }

    
    private writeLog(log: string) {
        // write log with asynchronously
        fs.appendFile(this.logFilePath, log + '\n', (err) => {
            if (err) {
                console.error('Failed to write log:', err);
            }
        });
    }

    public logMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const currentTime = new Date().toISOString();
        const logMessage = `${currentTime} - ${req.method} ${req.url} - ${req.ip}`;

        this.writeLog(logMessage);

        next();
    };

}

export default Logger