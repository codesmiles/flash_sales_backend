import { Sale, Promo, Product } from "../Models";
import { type ClientSession } from "mongoose";
import type { IProduct, ISale } from "../Interface";

type BuyProductType = { productId: string, units: number, userId:string }
type BuyPromoProductType = { productId: string, promoId: string, units: number };
export type AvailablePromoProductType = { promoId: string, per_page: number, current_page: number };
abstract class CustomerAbstract {
    abstract buyProduct(payload: BuyProductType, session: ClientSession): Promise<ISale>;
    abstract buyPromoProduct(payload: BuyPromoProductType, session: ClientSession): Promise<ISale>;
    abstract availablePromoProduct(payload: AvailablePromoProductType, session?: ClientSession): Promise<IProduct[]>;
}


export class CustomerService extends CustomerAbstract {
    async buyProduct(payload: BuyProductType, session: ClientSession): Promise<ISale> {

        // find product by id and check if it exists
        // check the available unit left and return an error if its at 0 or after deducting the units it will be less than 0
        // update the available units
        const product = await Product.findOneAndUpdate(
            { _id: payload.productId, units: { $gte: payload.units } },
            { $inc: { units: -payload.units } },
            {  session, new: true, select:"price" }
        );
        if (!product) throw new Error("Invalid product | insufficient inventory | product not found");
        
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
        const findPromo = await Promo.findOne({ _id: payload.promoId, is_active:true }).session(session);
        if (!findPromo) throw new Error("unable to find promo")
        
        // find product by id check if is_promo is true and check both units and available units
        // if assigned promo unit or regular === 0 or regular unit <= promo unit update the the is_promo to false and return an error
        // If the purchasing promo unit when deducted is going to be less than 0 return an error
        // Update the product according to the units create a sales receipt for the promo purchase and return the sales receipts
        // return a success and commit the transaction
        // if any error occurs rollback the transaction and return an error message
    }

    async availablePromoProduct(payload: AvailablePromoProductType, session?: ClientSession): Promise<IProduct[]> {
        // apply cache middleware here to cache pages every 1 hour
        //use the promoId to find all the products attached to promo based on their details
        // reduce excess data from the incomng products at the database level
        // find promo by id
        // cache each page per hour
        // return the promo and all the products attached to it in a paginated format
    }

}