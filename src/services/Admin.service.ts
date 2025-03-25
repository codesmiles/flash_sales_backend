import { Sale,Promo } from "../Models";
import {seed_promo_product, seed_product} from "../Seeder"

import type { IProduct,IPromo,ISale } from "../Interface";

type PromoType = { name: string, start_date: Date, is_active: boolean };
type PromoProductType = { promo: IPromo, product: IProduct };

abstract class AdminAbstract {
    abstract createProduct(): Promise<IProduct[] | null>;
    abstract createPromoProduct(): Promise<PromoProductType | null>;
    abstract createPromo(payload:PromoType): Promise<IPromo | null >
    abstract activePromo(): Promise<IPromo[] | null>;
   
}


export class AdminService extends AdminAbstract { 
    async createProduct(): Promise<IProduct[] | null> {
        // seed new product in the database(on development mode only)
        const create_product = await seed_product();
        return create_product
    
}
    async createPromoProduct(): Promise<{ promo: IPromo, product: IProduct } | null> {
        // seed a new promo product in the database(on development mode only)
        const newPromoProduct = await seed_promo_product();
        return newPromoProduct;
    }
    async activePromo(): Promise<IPromo[] | null> {
        // find and active the promo product(on development mode only)
        const promo = await Promo.find({ is_active: true });
        if (!promo.length) return null;
        return promo;
    }

    async createPromo(payload: PromoType): Promise<IPromo | null> {
        const newPromo = await Promo.create({ payload });
        if(!newPromo) return null;
        return newPromo;
    }


}