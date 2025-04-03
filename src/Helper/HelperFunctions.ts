import jwt, {type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const confirmPassword = async (password: string, hash: string) => {
    return await Bun.password.verify(password, hash);
};


export const signJwt = ( data: object, expires = 24 * 60 * 60 * 60) => {
    return jwt.sign(data, JWT_SECRET, {
        expiresIn: expires,
    });
};

export const checkJwt = (hash: string): JwtPayload | string => {
    const token = jwt.verify(hash, JWT_SECRET);
    return token;
}

export const generateRandomOTP = (length: number = 6): string => {
    return Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)).toString();
};

export const toJson = (msg: string, status: number, data: unknown) => {
    return {
        message: msg,
        status: status,
        data: data
    };
}