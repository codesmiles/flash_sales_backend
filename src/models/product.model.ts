import { type IProduct } from "../interface";
import { Schema, model } from "mongoose";

const ProductSchema: Schema = new Schema<IProduct>(
    {},

    {
        timestamps: true,
    }
);


export const Product = model<IProduct>("Product", ProductSchema);
