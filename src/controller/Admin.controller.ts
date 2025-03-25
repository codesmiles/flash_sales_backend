import { AdminService } from "../Services";
import { type Response, type Request } from "express";
import { validator, validateUser, validateLogin, validateForgotPassword, validateResetPassword } from "../Helper";


const adminService = new AdminService();

const toJson = (msg: string, status: number, data: unknown) => {
    return {
        message: msg,
        status: status,
        data: data
    };
}

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