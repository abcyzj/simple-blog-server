import {Document, Schema, Model, model} from 'mongoose';
import crypto from 'crypto';

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['Normal', 'Root'],
    },
});

function hashPassword(password: string, salt: string) {
    return new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                return reject(err);
            }

            resolve(derivedKey.toString('hex'));
        });
    });
}

userSchema.pre('save', async function(next) {
    const curUser: IUser = this as IUser;
    if (!curUser.salt || curUser.isModified('password')) {
        curUser.salt = Math.random().toString(36).substr(2);
        curUser.password = await hashPassword(curUser.password, curUser.salt);
    }
    next();
});

userSchema.methods.checkPassword = async function(password: string) {
    const curUser: IUser = this as IUser;
    const hashedPassword = await hashPassword(password, curUser.salt);
    return hashedPassword === curUser.password;
};

export interface IUser extends Document {
    username: string;
    password: string;
    salt: string;
    role?: string;
    checkPassword: (password: string) => Promise<boolean>;
}

export const User: Model<IUser> = model('User', userSchema);
