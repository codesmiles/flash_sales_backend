import { UserService } from "../Services";
import { type Response, type Request } from "express";
import { validator, validateUser, validateLogin, validateForgotPassword, validateResetPassword } from "../Helper";
import { type IUser, type CustomRequest } from "../Interface";


const authService = new UserService();

const toJson = (msg: string, status: number, data: unknown) => {
    return {
        message: msg,
        status: status,
        data: data
    };
}

export const createUser = async (req: Request, res: Response) => {
    try {
        console.log("CREATE USER");
        const validate_req_payload = validator(validateUser, req.body);

        // check if validation fails
        if (validate_req_payload) {
            return res.status(400).json(validate_req_payload);
        }

        // create user
        const user = await authService.createUser(req.body);
        return res.status(200).json(toJson("Operation Success", 200, user));
    } catch (err) {
        return res.status(400).json(toJson("Bad Request", 400, err));
    }
};

export const loginUser = async (req: Request, res: Response) => {
   
    try {
        // validate requests
        const validate_req_payload = validator(validateLogin, req.body);
        if (validate_req_payload) {
            return res.status(400).json(validate_req_payload);
        }

        const response = await authService.loginUser(req.body);
        if (response == null) {
            return res.status(400).json(toJson("Login Error",400,null));
        }
        return res.status(200).json(toJson("Login Success",200,response));
    } catch (err) {
        return res.status(400).json(toJson("Bad Request", 400, err));
    }
};

export const forgotPassword = async (req: CustomRequest, res: Response) => {
    try {
        const validate_req_payload = validator(validateForgotPassword, req.body);
        if (validate_req_payload) {
            return res.status(400).json(validate_req_payload);
        }

        const response = await authService.forgotPassword(req.body);
        if (!response) {
            return res.status(404).json(toJson("User Not Found",404,null ));
        }
        return res.status(200).json(toJson("Operation Success",200,null));
    } catch (err) {
        return res.status(400).json(toJson("Bad Request", 400, err));
    }
};

export const resetPassword = async (req: CustomRequest, res: Response) => {
    try {
        const validate_req_payload = validator(validateResetPassword, req.body);

        // check if validation fails
        if (validate_req_payload) {
            return res.status(400).json(validate_req_payload);
        }

        const response = await authService.resetPassword(req.body);
        if (!response) {
            return res.status(404).json(toJson("User Not Found", 404, null));
        }
        return res.status(200).json(toJson("Operation Success",200,null));
    } catch (err) {
        return res.status(400).json(toJson("Bad Request", 400, err));
    }
};
