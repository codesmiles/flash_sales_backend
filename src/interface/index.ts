export * from "./User.interface";
export * from "./Sale.interface";
export * from "./Product.interface";
export * from "./Promo.interface";

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}