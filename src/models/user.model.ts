import { UserRoles } from "../Helper";
import { type IUser } from "../Interface";
import { Schema, model } from "mongoose";

const UserSchema: Schema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'A user must have a name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        },
        role: {
            type: String,
            required: true,
            lowercase: true,
            enum: Object.values(UserRoles)
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        }
    },
    {
        timestamps: true,
    }
);

// Password encryption middleware
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await Bun.password.hash(this.password as string);
    next();
});




export const User = model<IUser>("User", UserSchema);

