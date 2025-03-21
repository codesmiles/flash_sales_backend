import { Document, Schema } from 'mongoose';

export interface IPromo extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    start_date: Date;
    is_active: boolean;
}
