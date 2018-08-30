import Router from 'koa-router';
import CONFIG from '../config';
import { User } from '../models/User';
import bodyParser from 'koa-bodyparser';
import jsonwebtoken from 'jsonwebtoken';
import { Category, ICategory } from '../models/Category';
import logger from '../logger';
import { Article } from '../models/Article';

const adminRouter = new Router();

adminRouter.use(bodyParser());

const tokenWhiteList = [/^\/api\/login/];
adminRouter.use(async (ctx, next) => {
    for (const reg of tokenWhiteList) {
        if (ctx.path.match(reg)) {
            return await next();
        }
    }

    if (!ctx.request.header['authorization']) {
        ctx.status = 401;
        return ctx.throw(401);
    }

    try {
        ctx.state.user = jsonwebtoken.verify(ctx.request.header['authorization'], CONFIG.JWT_SECRET);
    } catch (err) {
        ctx.status = 401;
        return ctx.throw(401);
    }
    await next();
});

adminRouter.post('/login', async (ctx) => {
    if (!ctx.request.body) {
        return ctx.throw(400);
    }

    const body = ctx.request.body as any;
    const user = await User.findOne({username: body.username});
    if (!user || !await user.checkPassword(body.password)) {
        return ctx.body = {success: false};
    }

    const token = jsonwebtoken.sign({
        username: user.username,
        role: user.role,
        iat: Date.now(),
    }, CONFIG.JWT_SECRET, {expiresIn: CONFIG.TOKEN_EXPIRATION_TIME});

    ctx.body = {
        success: true,
        token,
    };
});

adminRouter.post('/setPassword', async (ctx) => {
    const userInfo = ctx.state.user;
    const body = ctx.request.body as any;
    const user = await User.findOne({username: userInfo.username});
    try {
        if (!user || !await user.checkPassword(body.password)) {
            throw new Error(`User ${userInfo.username} change password failed.`);
        }

        user.password = body.newPassword;
        await user.save();
    } catch (err) {
        logger.error(err);
        return ctx.body = {success: false};
    }

    logger.info(`User ${userInfo.username} changed password.`);
    return ctx.body = {success: true};
});

adminRouter.get('/userInfo', async (ctx) => {
    const user = await User.findOne({username: ctx.state.user.username});
    if (user) {
        ctx.body = {
            username: user.username,
            role: user.role,
        };
    } else {
        ctx.status = 400;
    }
});

adminRouter.get('/categoryTable', async (ctx) => {
    const categories = await Category.find();
    ctx.body = [];
    for (const category of categories) {
        ctx.body.push({
            id: category._id,
            name: category.name,
            articleNumber: category.articleIds.length,
            viewNumber: await category.getViewNumber(),
        });
    }
});

adminRouter.post('/setCategoryName', async (ctx) => {
    const data = ctx.request.body as any;
    try {
        await Category.findByIdAndUpdate(data.id, {name: data.name});
    } catch (err) {
        logger.error(err);
        return ctx.body = {success: false};
    }

    ctx.body = {success: true};
});

adminRouter.post('/deleteCategory', async (ctx) => {
    const data = ctx.request.body as any;
    try {
        await Category.findByIdAndRemove(data.id);
    } catch (err) {
        logger.error(err);
        return ctx.body = {success: false};
    }

    ctx.body = {success: true};
});

adminRouter.post('/addCategory', async (ctx) => {
    const data = ctx.request.body as any;
    try {
        const newCategory = new Category({
            name: data.name,
        });
        await newCategory.save();
    } catch (err) {
        logger.error(err);
        return ctx.body = {success: false};
    }

    ctx.body = {success: true};
});

adminRouter.get('/articleTable', async (ctx) => {
    const articles = await Article.find();
    const resData: any[] = [];
    for (const article of articles) {
        const category = await Category.findById(article.category) as ICategory;
        resData.push({
            id: article._id,
            title: article.title,
            date: article.date.toLocaleString(),
            viewNumber: article.viewNumber,
            categoryId: article.category,
            categoryName: category.name,
        });
    }
    ctx.body = resData;
});

adminRouter.post('/deleteArticle', async (ctx) => {
    const data = ctx.request.body as any;
    try {
        const removedArticle = await Article.findByIdAndRemove(data.id);
        if (!removedArticle) {
            throw new Error();
        }
        await Category.findByIdAndUpdate(removedArticle.category, {$pull: {articleIds: removedArticle._id}});
    } catch (err) {
        logger.error(err);
        return ctx.body = {success: false};
    }

    ctx.body = {success: true};
});

export default adminRouter;
