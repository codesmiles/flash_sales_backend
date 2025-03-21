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
            type: Number,
            required: [true, 'A product must have a price']
        },
        unit: {
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
                unit: {
                    type: Number,
                    default: 0
                },
                price: {
                    type: Number,
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

// Custom validation to ensure promo_conditions is provided when has_promo is true
// ProductSchema.pre('validate', function (next) {
//     if (this.is_promo === true && (this.is_promo && !(this.promo_conditions as any)?.price)) {
//         this.invalidate('promo_conditions.price', 'The price for this promo product must be provided');
//     }
//     next();
// });

export const Product = model<IProduct>("Product", ProductSchema);
