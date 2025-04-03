import { faker } from '@faker-js/faker';
import { Promo,Product } from "../Models"
import type { IProduct, IPromo } from '../Interface';

const promo = {
    name: "flash-sales",
    start_date: faker.date.soon({ days: 1 }),
    is_active: true,
}

const price = faker.commerce.price({ min: 100 })
const discount = Number(price) - Math.floor(Math.random() * Number(price))

const promoProduct = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: price,
    units: 250,
    is_promo: true,
    promo_details: {
        promo_id: "",
        units: 200,
        price: faker.commerce.price({ max: discount }),
    },

}

export const seed_promo_product = async ():Promise<{promo: IPromo,product: IProduct}> => {
    let newPromo = await Promo.create(promo);
    console.log(`Created Promo: ${newPromo?.name}`);
    
    promoProduct.promo_details.promo_id = newPromo.id;
    let newProduct = await Product.create(promoProduct);
    console.log(`Created Product: ${newProduct?.name}`);
    
    const response = {
        promo: newPromo,
        product: newProduct,
    };

    console.log(response);
    return response;
}

// export const users = faker.helpers.multiple(createRandomUser, {
//     count: 5,
// });