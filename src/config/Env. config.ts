declare module "bun" {
    interface Env {
        MONGODB_URL: string;
        AWS_REGION: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
    }
}