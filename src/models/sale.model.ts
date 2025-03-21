import { type ISale } from "../Interface";
import { Schema, model } from "mongoose";

const SaleSchema: Schema = new Schema<ISale>(
  {
    price: {
      type: Number,
      required: [true, "A sale must have a price"],
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A sale must belong to a user"]
    },

    quantity: {
      type: Number,
      required: [true, "A sale must have a quantity"],
    },

    is_promo: {
      type: Boolean,
      required: [true, "A sale must have a promo status"],
      default: false
    },

    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "A sale must belong to a product"]
    },
  },
  {
    timestamps: true,
  }
);

export const Sale = model<ISale>("Sale", SaleSchema);
