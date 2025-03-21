import { Document,Schema } from 'mongoose';

export interface IProduct extends Document { 
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    unit: number;
    is_promo: boolean;
    promo_details: {
        promo_id: Schema.Types.ObjectId;
        unit: number; 
        price: number;
    }
}
