import { Document, Schema } from 'mongoose';

export interface ISale extends Document{
    _id: Schema.Types.ObjectId;
    price: number;
    user_id: Schema.Types.ObjectId;
    quantity: number;
    is_promo: boolean;
    product_id: Schema.Types.ObjectId;
}