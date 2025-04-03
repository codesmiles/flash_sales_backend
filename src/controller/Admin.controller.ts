import { AdminService } from "../Services";
import { type Response, type Request } from "express";
import { toJson } from "../Helper";


const adminService = new AdminService();



export const createPromo = async (req: Request, res: Response) => {
    try {
        //TODO: validate incoming request


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