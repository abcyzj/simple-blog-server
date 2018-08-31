import CONFIG from './config';
import Koa from 'koa';
import koaLogger from 'koa-logger';
import logger from './logger';
import serve from 'koa-static';
import router from './modules';

const app = new Koa();
app.use(koaLogger());

app.use(async (ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404;
        if (status === 404) {
            ctx.status = 404;
            ctx.throw(404);
        }
    } catch (err) {
        switch (err.status) {
            case 404:
            ctx.redirect(CONFIG.PAGE404_URL);
            break;
            default:
            break;
        }
    }
});

app.use(serve(CONFIG.BLOG_STATIC_DIR, {maxage: CONFIG.CACHE_MAX_AGE}));

app.use(router.routes());

app.listen(CONFIG.LISTEN_PORT, () => {
    logger.info(`Server listening on ${CONFIG.LISTEN_PORT}`);
});
