import {Schema, Model, model, Document} from 'mongoose';
import {Article} from '.';

const categorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    articleIds: {
        type: [Schema.Types.ObjectId],
        ref: 'Article',
    },
});

categorySchema.methods.getViewNumber = async function(this: ICategory) {
    let viewNumber = 0;
    for (const id of this.articleIds) {
        const article = await Article.findById(id);
        if (article) {
            viewNumber += article.viewNumber;
        }
    }
    return viewNumber;
};

export interface ICategory extends Document {
    name: string;
    articleIds: Schema.Types.ObjectId[];
    getViewNumber: () => Promise<number>;
}

export const Category: Model<ICategory> = model('Category', categorySchema);
