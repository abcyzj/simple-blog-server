import {connect} from 'mongoose';
import CONFIG from '../config';
import logger from '../logger';

connect(CONFIG.DB_ADDR, {
    useNewUrlParser: true,
    },
    (err) => {
        if (err) {
            logger.error(err.message);
        }
    },
);

export {Article, IArticle} from './Article';
export {User, IUser} from './User';
export {Category, ICategory} from './Category';
