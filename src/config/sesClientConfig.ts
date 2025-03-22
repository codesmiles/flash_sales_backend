import { SESClient } from "@aws-sdk/client-ses";
// Set the AWS Region.
const aws_cred = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}

export const sesClient = new SESClient(aws_cred);
