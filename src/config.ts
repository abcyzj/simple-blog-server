import path from 'path';

let logfilePath: string;
if (process.env['HOME'] === undefined) {
    logfilePath = process.cwd();
} else {
    logfilePath = path.join(process.env['HOME'] as string, 'logs', 'simple-blog.log');
}

let dbAddr = 'mongodb://localhost:27017/simple-blog';
if (process.env.NODE_ENV !== 'production') {
    dbAddr = 'mongodb://localhost:27017/test';
}

export default {
    LISTEN_PORT: 8080,
    LOGFILE_PATH: logfilePath,
    BLOG_STATIC_DIR: 'dist/blog-static',
    PAGE404_URL: '/#/404',
    DB_ADDR: dbAddr,
    EXERPT_LENGTH: 40,
};
