import 'dotenv/config';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';

// Logger class role = write log
class Logger{
    private logFilePath:string
    
    constructor(){
        this.logFilePath = "경로";
    }

    
    // 로그 작성 메서드
    private writeLog(log: string) {
        // 로그 파일에 비동기적으로 기록
        fs.appendFile(this.logFilePath, log + '\n', (err) => {
            if (err) {
                console.error('Failed to write log:', err);
            }
        });
    }

    // 미들웨어 역할을 하는 메서드
    public logMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const currentTime = new Date().toISOString();
        const logMessage = `${currentTime} - ${req.method} ${req.url} - ${req.ip}`;

        // 로그 파일에 기록
        this.writeLog(logMessage);

        // 다음 미들웨어로 넘어가기
        next();
    };

}

export default Logger