import { Document,Schema } from 'mongoose';

export interface IProduct extends Document { 
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    price: string;
    units: number;
    is_promo: boolean;
    promo_details: {
        promo_id: Schema.Types.ObjectId;
        units: number; 
        price: string;
    }
}
