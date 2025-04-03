import type { UserRoles } from "../Helper";
import {type Request} from "express";

export * from "./User.interface";
export * from "./Sale.interface";
export * from "./Product.interface";
export * from "./Promo.interface";
export * from "./Request.interface";

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

export interface SimplePaginatedResponse<T>{
    data: T[];
    meta: {
        page: number;
        total: number;
        totalItems: number;
    }
}

export type UserTokenDecrypted = {
    email: string;
    id: string;
    role: UserRoles;
};

export interface CustomRequest extends Request {
    user: UserTokenDecrypted;
}