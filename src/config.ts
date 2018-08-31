import path from 'path';
import fs from 'mz/fs';

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

let JWTSecret: string = 'default-secret';
if (fs.existsSync('~/.secret/simple-blog.secret')) {
    JWTSecret = fs.readFileSync('~/.secret/simple-blog.secret', {encoding: 'utf8'});
}

export default {
    LISTEN_PORT: 8080,
    LOGFILE_PATH: logfilePath,
    BLOG_STATIC_DIR: 'blog-static',
    UPLOAD_IMG_DIR: 'uploadImg',
    PAGE404_URL: '/#/404',
    DB_ADDR: dbAddr,
    EXERPT_LENGTH: 40,
    JWT_SECRET: JWTSecret,
    TOKEN_EXPIRATION_TIME: '1d',
};
