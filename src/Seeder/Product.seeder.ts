import { faker } from '@faker-js/faker';
import { Product,Promo } from "../Models"
import type { IProduct } from '../Interface';


export const seed_product = async (count: number = 10): Promise<IProduct[]> => {
    await Promo.deleteMany({});
    await Product.deleteMany({});

    // Create an array of the specified count
    const products = Array.from({ length: count }, () => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 2 }),
        units: 250,
        is_promo: false,
    }));

    const productArr = [];

    for (const product of products) {
        let newProduct = await Product.create(product);
        console.log(`Created Product: ${newProduct.name}`);
        productArr.push(newProduct);
    }
    return productArr;
}