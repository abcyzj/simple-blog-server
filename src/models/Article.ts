import {Model, Document, Schema, model} from 'mongoose';

const articleSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    viewNumber: {
        type: Number,
        default: 0,
        required: true,
    },
});

export interface IArticle extends Document {
    title: string;
    content: string;
    date: Date;
    viewNumber: number;
}

export const Article: Model<IArticle> = model<IArticle>('Article', articleSchema);
