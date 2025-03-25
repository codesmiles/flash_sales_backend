import { Sale, Promo } from "../Models";

import type { IProduct, ISale } from "../Interface";

type BuyProductType = { productId: string, units: string }
type BuyPromoProductType = { productId: string, promoId: string, units: string };
type AvailablePromoProductType = {promoId:string, per_page: number, current_page: number};
abstract class CustomerAbstract {
    abstract buyProduct(payload: BuyProductType): Promise<ISale>;
    abstract buyPromoProduct(payload: BuyPromoProductType): Promise<ISale>;
    abstract availablePromoProduct(payload: AvailablePromoProductType): Promise<IProduct>;
}


export class CustomerService extends CustomerAbstract { 
    async buyProduct(payload: BuyProductType): Promise<ISale> {
        // start session and transaction
        // find product by id and check if it exists
        // check the available unit left and return an error if its at 0 or after deducting the units it will be less than 0
        // update the available units and create a sales receipt
        // end the session and commit the transaction
        // return a successful transaction and sales receipt
        // if any error occurs rollback the transaction and return an error message
    }

    async buyPromoProduct(payload: BuyProductType): Promise<ISale> {
        // start the transaction
        // find promo by id and check if it's active
        // find product by id check if is_promo is true and check both units and available units
        // if assigned promo unit or regular === 0 or regular unit <= promo unit update the the is_promo to false and return an error
        // If the purchasing promo unit when deducted is going to be less than 0 return an error
        // Update the product according to the units create a sales receipt for the promo purchase and return the sales receipts
        // return a success and commit the transaction
        // if any error occurs rollback the transaction and return an error message
    }

    async availablePromoProduct(payload: AvailablePromoProductType): Promise<IProduct> {
        // apply cache middleware here to cache pages every 1 hour
        //use the promoId to find all the products attached to promo based on their details
        // reduce excess data from the incomng products at the database level
        // find promo by id
        // cache each page per hour
        // return the promo and all the products attached to it in a paginated format
    }
    
}