import { type IPromo } from "../Interface";
import { Schema, model } from "mongoose";

const PromoSchema: Schema = new Schema<IPromo>(
    {
        name: {
            type: String,
            required: [true, 'A promo must have a name'],
            default: "flash_sales",
            trim: true
        },
        start_date: {
            type: Date,
            required: [true, 'A promo must have a start date'],
        },
        is_active: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true,
    }
);
PromoSchema.index({ is_active: 1, start_date: 1 })

export const Promo = model<IPromo>("Promo", PromoSchema);

