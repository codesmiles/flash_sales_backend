import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../Config"


export class MailDispatcher {
    private readonly to;
    private readonly from = process.env.SENDER_EMAIL_ADDRESS as string;
    private readonly subject;
    private readonly content;
    private readonly canReplyMessage;


    constructor(to: string, subject: string, content: string, canReplyMessage?: boolean) {
        this.to = to;
        this.content = content;
        this.subject = subject;
        this.canReplyMessage = canReplyMessage;
    }

    async send_text_email() {
        const text_mail = new SendEmailCommand({
            Destination: { ToAddresses: [this.to] },
            Message: {
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: this.content,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: this.subject,
                },
            },
            Source: this.from,
            ReplyToAddresses: this.canReplyMessage ? [this.from] : undefined, 
        });

        try {
            return await sesClient.send(text_mail);
        } catch (caught) {
            if (caught instanceof Error && caught.name === "MessageRejected") {
                /** @type { import('@aws-sdk/client-ses').MessageRejected} */
                const messageRejectedError = caught;
                throw messageRejectedError;
            }
            throw caught;
        }
    }

    async send_template_email() {
        const html_mail = new SendEmailCommand({
            Destination: {
                ToAddresses: [
                    this.to,
                ],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: this.content,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: this.subject,
                },
            },
            Source: this.from,
            ReplyToAddresses: this.canReplyMessage ? [this.from] : undefined, 
        })

        try {
            return await sesClient.send(html_mail);
        } catch (caught) {
            if (caught instanceof Error && caught.name === "MessageRejected") {
                /** @type { import('@aws-sdk/client-ses').MessageRejected} */
                const messageRejectedError = caught;
                return messageRejectedError;
            }
            throw caught;
        }

    }
}
