import { type IPurchase } from "../interface";
import { Schema, model } from "mongoose";

const PurchaseSchema: Schema = new Schema<IPurchase>(
    {},

    {
        timestamps: true,
    }
);


export const Purchase = model<IPurchase>("Purchase", PurchaseSchema);
