import { type ISale } from "../interface";
import { Schema, model } from "mongoose";

const SaleSchema: Schema = new Schema<ISale>(
  {},

  {
    timestamps: true,
  }
);


export const Sale = model<ISale>("Sale", SaleSchema);
