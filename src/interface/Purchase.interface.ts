import { Document, Schema } from 'mongoose';

export interface IPurchase extends Document { 
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    sale: Schema.Types.ObjectId;
    product: Schema.Types.ObjectId;
    quantity: number;
    purchaseTime: Date;
}