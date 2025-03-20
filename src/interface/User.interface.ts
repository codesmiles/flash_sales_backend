import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    // purchases: Schema.Types.ObjectId[];
}