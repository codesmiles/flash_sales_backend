import { AdminService } from "../Services";
import { type Response, type Request } from "express";
import { toJson } from "../Helper";
import { validator, validateCreatePromo } from "../Helper";


const adminService = new AdminService();



export const createPromoController = async (req: Request, res: Response) => {
    try {
        // validate incoming request
        const validate_req_payload = validator(validateCreatePromo, req.body);

        if (validate_req_payload) {
            return res.status(400).json(validate_req_payload);
        }

        // call the service
        const response = await adminService.createPromo(req.body);
        if (!response) {
            return res.status(400).json(toJson("Unable to create Promo", 400, null));
        }
        
        // return response
        return res.status(200).json(toJson("Operation Success", 200, response));
    } catch (err) {
        return res.status(400).json(toJson("Bad Request", 400, err));
    }
};

export const createPromoProductController = async(req: Request, res: Response) => {
    try {
        // call the service
        const response = await adminService.createPromoProduct();
        if (!response) {
            return res.status(400).json(toJson("Unable to create Promo Product", 400, null));
        }
        
        // return response
        return res.status(200).json(toJson("Operation Success", 200, response));
    } catch (err) {
        return res.status(400).json(toJson("Bad Request", 400, err));
    }
}

export const activePromoController = async (req: Request, res: Response) => { 
    try {
        // call the service
        const response = await adminService.activePromo();
        if (!response) {
            return res.status(404).json(toJson("No active Promo", 404, null));
        }
        
        // return response
        return res.status(200).json(toJson("Operation Successful", 200, response));
    } catch (err) {
        return res.status(400).json(toJson("Bad Request", 400, err));
    }
}

export const createProductController = async (req: Request, res: Response) => { 
    try {
        // call the service
        const response = await adminService.createProduct();
        if (!response) {
            return res.status(400).json(toJson("Unable to create Product", 400, null));
        }
        
        // return response
        return res.status(200).json(toJson("Operation Successful", 200, response));
    } catch (err) {
        return res.status(400).json(toJson("Bad Request", 400, err));
    }
}