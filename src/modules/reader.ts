import Router from 'koa-router';
import {Category, Article} from '../models';
import CONFIG from '../config';
import removeMd from 'remove-markdown';
import logger from '../logger';

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
        await article.update({$inc: {viewNumber: 1}});
        logger.info(`Article ${article.title} get read.`);
        return ctx.body = {
            title: article.title,
            content: article.content,
        };
    } else {
        return ctx.status = 404;
    }
});

readerRouter.get('/aboutArticle', async (ctx) => {
    const article = await Article.findOne({
        $and: [
            {role: {$exists: true}},
            {role: 'about'},
        ],
    });

    if (article) {
        ctx.body = {id: article._id};
    }
});

export default readerRouter;
