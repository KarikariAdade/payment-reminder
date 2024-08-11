import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';  // Import DailyRotateFile correctly
import { join } from 'path';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new DailyRotateFile({
            filename: join(__dirname, '../../logs/application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d' // keep logs for 14 days
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}
