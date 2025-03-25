declare module "bun" {
    interface Env {
        APP_NAME: string;
        AWS_REGION: string;
        MONGODB_URL: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
    }
}