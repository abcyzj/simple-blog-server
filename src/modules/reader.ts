import Router from 'koa-router';
import {Category, Article} from '../models';
import CONFIG from '../config';
import removeMd from 'remove-markdown';

const readerRouter = new Router();

readerRouter.get('/categories', async (ctx) => {
    const categories: string[] = await Category.distinct('name');
    ctx.status = 200;
    return ctx.body = categories;
});

readerRouter.get('/list/:category', async (ctx) => {
    const category = await Category.findOne({name: ctx.params.category});
    if (category) {
        return ctx.body = category.articleIds;
    } else {
        return ctx.body = [];
    }
});

readerRouter.get('/articleInfo/:articleId', async (ctx) => {
    const article = await Article.findById(ctx.params.articleId);
    if (article) {
        return ctx.body = {
            title: article.title,
            excerpt: removeMd(article.content).substr(0, CONFIG.EXERPT_LENGTH),
        };
    } else {
        return ctx.body = {};
    }
});

readerRouter.get('/article/:id', async (ctx) => {
    const article = await Article.findById(ctx.params.id);
    if (article) {
        return ctx.body = {
            title: article.title,
            content: article.content,
        };
    } else {
        return ctx.status = 404;
    }
});

export default readerRouter;
