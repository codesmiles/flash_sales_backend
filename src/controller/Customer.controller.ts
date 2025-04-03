import { CustomerService, type AvailablePromoProductType } from "../Services";
import type {  Response } from "express";
import {startSession} from "mongoose";
import { validator, validateBuyProduct, validateBuyPromoProduct, validateAvailablePromoProduct } from "../Helper";
import {type CustomRequest} from "../Interface"



const customerService = new CustomerService();

const toJson = (msg: string, status: number, data: unknown) => {
    return {
        message: msg,
        status: status,
        data: data
    };
}

// TODO: update this to an autheneticated route
export const purchase_product = async (req: CustomRequest, res: Response) => {
    const session = await startSession();

    try {
        // validate incoming request
        const validate_req_payload = validator(validateBuyProduct, req.body);
        if (validate_req_payload) {
            return res.status(400).json(validate_req_payload);
        }
        // start transaction
        session.startTransaction();
        console.log("Transaction started");

        const purchase = await customerService.buyProduct(req.body, session);
        if (!purchase) {
            return res.status(400).json(toJson("Unable to purchase product", 400, null));
        }

        await session.commitTransaction();
        console.log("Transaction committed successfully");

        return res.status(200).json(toJson("Operation Successful", 200, purchase));
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction aborted due to error:", error);
        return res.status(400).json(toJson("Bad Request", 400, error));
    } finally {
        session.endSession();
    }
};

export const purchase_promo_product = async (req: CustomRequest, res: Response) => { 
    const session = await startSession();

    try {
        // validate incoming request
        const validate_req_payload = validator(validateBuyPromoProduct, req.body);
        if (validate_req_payload) {
            return res.status(400).json(validate_req_payload);
        }

        // start transaction
        session.startTransaction();

        const purchase_promo_product = await customerService.buyPromoProduct(req.body, session);

        await session.commitTransaction();
        console.log("Transaction committed successfully");

        return res.status(200).json(toJson("Operation Successful", 200, purchase_promo_product));
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction aborted due to error:", error);
        return res.status(400).json(toJson("Bad Request", 400, error));
    } finally {
        session.endSession();
    }
}


export const available_promo_product = async (req: CustomRequest, res: Response) => { 
    try {
        const query = {
            promoId: req.query.promoId as string,
            per_page: Number(req.query.per_page) || 10,
            current_page: Number(req.query.current_page) || 1
        } as AvailablePromoProductType;

        // validate incoming request
        const validate_req_payload = validator(validateAvailablePromoProduct, query);
        if (validate_req_payload) {
            return res.status(400).json(validate_req_payload);
        }

        const available_promo_product = await customerService.availablePromoProduct(query);
        if (!available_promo_product) {
            return res.status(404).json(toJson("Promo not found", 404, null));
        }

        return res.status(200).json(toJson("Operation Successful", 200, available_promo_product));
    } catch (error) {
        return res.status(400).json(toJson("Bad Request", 400, error));
    }
}
