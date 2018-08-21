import {configure, getLogger} from 'log4js';
import CONFIG from './config';

configure({
    appenders: {
        console: {type: 'stdout'},
        logfile: {
            type: 'file',
            filename: CONFIG.LOGFILE_PATH,
            maxLogSize: 10 * 1024 * 1024,
            backups: 3,
            compress: true,
        },
    },
    categories: {
        default: {
            appenders: ['console', 'logfile'],
            level: 'info',
        },
    },
});

const logger = getLogger();
export default logger;
