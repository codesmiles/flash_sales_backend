import { Sale, Promo, Product } from "../Models";
import { type ClientSession } from "mongoose";
import type { IProduct, ISale, SimplePaginatedResponse } from "../Interface";
import { CacheService } from "./Cache.service";

export type BuyProductType = { productId: string, units: number, userId: string }
export type BuyPromoProductType = { productId: string, promoId: string, units: number, userId: string };
export type AvailablePromoProductType = { promoId: string, per_page: number, current_page: number };

abstract class CustomerAbstract {
    abstract buyProduct(payload: BuyProductType, session: ClientSession): Promise<ISale>;
    abstract buyPromoProduct(payload: BuyPromoProductType, session: ClientSession): Promise<ISale>;
    abstract availablePromoProduct(payload: AvailablePromoProductType, session?: ClientSession): Promise<SimplePaginatedResponse<IProduct>>;
}


export class CustomerService extends CustomerAbstract {
    async buyProduct(payload: BuyProductType, session: ClientSession): Promise<ISale> {


        // find product by id and check if it exists
        // check the available unit left and return an error if its at 0 or after deducting the units it will be less than 0
        // update the available units
        const product = await Product.findOneAndUpdate(
            { _id: payload.productId, units: { $gte: payload.units } },
            { $inc: { units: -payload.units } },
            { session, new: true, select: "price" }
        );
        if (!product) throw new Error(`Invalid product | insufficient inventory | product not found | ${product}`);


        // create a sales receipt
        const sales_payload = {
            is_promo: false,
            user_id: payload.userId,
            quantity: payload.units,
            product_id: payload.productId,
            price: payload.units * parseFloat(product.price),
        }

        const new_sale = new Sale(sales_payload);
        await new_sale.save({ session });

        // return a successful transaction and sales receipt
        return new_sale as ISale;

    }

    async buyPromoProduct(payload: BuyPromoProductType, session: ClientSession): Promise<ISale> {

        // find promo by id and check if it's active
        const findPromo = await Promo.findOne({ _id: payload.promoId, is_active: true }).session(session);
        if (!findPromo) throw new Error(`unable to find promo | Promo Is inactive | ${findPromo}`)

        /* find product by id check if is_promo is true and check both units and available units
        if assigned promo unit or regular === 0 or regular unit <= promo unit update the the is_promo to false and return an error
        If the purchasing promo unit when deducted is going to be less than 0 return an error
         Update the product according to the units create a sales receipt for the promo purchase and return the sales receipts
        */
        const update_product = await Product.findOneAndUpdate(
            {
                _id: payload.productId,
                is_promo: true,
                "promo_details.promo_id": payload.promoId,
                "promo_details.units": { $gte: payload.units },
                $expr: {
                    $gte: ["$units", "$promo_details.units"]
                }
            },
            {
                $inc: { "promo_details.units": -payload.units },
                $set: {
                    is_promo: {
                        $cond: {
                            if: {
                                $eq: [{ $subtract: ["$promo_details.units", payload.units] }, 0]
                            },
                            then: false,
                            else: true
                        }
                    }
                }
            },
            { session, new: true, select: "promo_details.price" })

        if (!update_product) throw new Error(`Invalid product | insufficient inventory | product not found | ${update_product}`);

        // create a sales receipt
        const sales_payload = {
            is_promo: true,
            user_id: payload.userId,
            quantity: payload.units,
            product_id: payload.productId,
            price: payload.units * parseFloat(update_product.price),
        }

        const new_sale = new Sale(sales_payload);
        await new_sale.save({ session });

        // return a successful transaction and sales receipt
        return new_sale as ISale;
    }


    async availablePromoProduct(payload: AvailablePromoProductType, session?: ClientSession): Promise<SimplePaginatedResponse<IProduct>> {
        //use the promoId to find all the products attached to promo based on their details
        const page = payload.current_page; // Default to page 1
        const limit = payload.per_page; // Default limit 10
        const skip = (page - 1) * limit;
        const query = { is_promo: true, "promo_details.promo_id": payload.promoId }
        const totalCount = await Product.countDocuments();

        // fetch product from cache
        const cacheService = new CacheService()
        const cache_response = cacheService.getData(`promoProduct_page_${page}`);
        if (cache_response) {
            return {
                data: cache_response as IProduct[],
                meta: {
                    page,
                    total: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                }
            };
        }

        // fetch product from database
        const products = await Product.find(query).skip(skip).limit(limit);

        // cache each page per hour
        cacheService.setData(`promoProduct_page_${page}`, products, 3600);
        
        // return the promo and all the products attached to it in a paginated format
        return {
            data: products,
            meta: {
                page,
                total: Math.ceil(totalCount / limit),
                totalItems: totalCount,
            }
        };
    }

}
