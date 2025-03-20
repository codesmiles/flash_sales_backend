import { Document,Schema } from 'mongoose';

export interface IProduct extends Document { 
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    stock: number;
    is_promo: boolean;
    promo_conditions: {
        name: string;
        stock: number; 
        price: number;
    }
}