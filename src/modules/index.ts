import Router from 'koa-router';
import readerRouter from './reader';
import adminRouter from './admin';

const router = new Router({
    prefix: '/api',
});

router.use(readerRouter.routes());
router.use(adminRouter.routes());

export default router;
