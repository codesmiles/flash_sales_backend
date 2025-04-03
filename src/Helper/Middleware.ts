import { checkJwt, toJson} from "./HelperFunctions";
import { type Response, type NextFunction } from "express";
import { type CustomRequest, type UserTokenDecrypted } from "../Interface";

export const verifyUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    let response;
    try {
        if (!req.headers?.authorization) {
            response = toJson("Unauthorized", 401, null);
            return res.status(401).json(response);
        }
        const token = checkJwt(
            req.headers.authorization?.split(" ")[1]
        ) as UserTokenDecrypted;
        if (!token) {
            response = toJson("Unauthorized", 401, null);
            return res.status(401).json(response);
        }
        req.user = token;
        next();
    } catch (err) {
        console.error(err);
        const response = toJson("Internal Server Error", 500, null);
        return res.status(500).json(response);
    }
};