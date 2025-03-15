import { Document,Schema } from 'mongoose';

export interface IProduct extends Document { 
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
}