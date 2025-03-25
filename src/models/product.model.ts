import { type IProduct } from "../Interface";
import { Schema, model } from "mongoose";

const ProductSchema: Schema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'A product must have a name'],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: String,
            required: [true, 'A product must have a price']
        },
        units: {
            type: Number,
            min: 0,
            required: [true, 'The stock for a product must be provided']
        },
        is_promo: {
            type: Boolean,
            default: false
        },
        promo_details: {
            type: {
                promo_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Promo',
                },
                units: {
                    type: Number,
                    default: 0
                },
                price: {
                    type: String,
                    required: function () {
                        return this.is_promo as boolean;
                    }
                },
            },
            required: function () {
                return this.is_promo === true;
            },
            default: undefined
        }

    },

    {
        timestamps: true,
    }
);

ProductSchema.index({ "promo_details.promo_id": 1 });

export const Product = model<IProduct>("Product", ProductSchema);
