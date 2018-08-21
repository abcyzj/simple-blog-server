import Router from 'koa-router';
import readerRouter from './reader';

const router = new Router({
    prefix: '/api',
});

router.use(readerRouter.routes());

export default router;
