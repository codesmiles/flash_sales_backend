import { User } from "../Models";
import { MailDispatcher,confirmPassword,signJwt,generateRandomOTP } from "../Helper";
import { CacheService } from "./Cache.service";

import { type IUser } from "../Interface";

type LoginType = { email: string, password: string };
type resetPasswordType = { otp:string,email: string, password: string };
type forgotPasswordType = { email: string };

abstract class UserAbstract {
    abstract loginUser(loginPayload: LoginType): Promise<object | null>;
    abstract createUser(payload:IUser): Promise<IUser | string>;
    abstract resetPassword(payload: resetPasswordType): Promise<boolean>;
    abstract forgotPassword(forgotPasswordPayload: forgotPasswordType): Promise<boolean>;
    // abstract leaderBoard(): Promise<IUser[]>;
}


export class UserService extends UserAbstract {
    private readonly cacheService: CacheService;
    constructor() {
        super();
        this.cacheService = new CacheService();
    }
    async createUser(payload: IUser): Promise<IUser | string> {
        // check if the user already exists
        const findUser = await User.findOne({ email: payload.email });
        if (findUser) return "User already exists";

        const user = await User.create(payload);
        console.log("USER CREATED===");
        return user.toObject({ getters: true });
    }

    async loginUser(loginPayload:LoginType ): Promise<object | null> {
        // check if user exists
        const user = await User.findOne({ email: loginPayload.email });

        if (!user || !(await confirmPassword(loginPayload.password, user.password))) return null

        // sign jwt token
        const token = signJwt({ email: user?.email, id: user?._id, role: user?.role });
        return { role: user.role, token };
    }


    async forgotPassword(payload: forgotPasswordType): Promise<boolean> {
        // check if user exists
        const findUser = await User.findOne(payload);
        if (!findUser) return false;

        // generate otp and cache it
        const userId = findUser._id;
        const otp = generateRandomOTP(6);
        this.cacheService.setData(`${otp}`, userId);
        console.log("OTP CACHED");

        // send email using mail dispatcher
        const subject = "Reset Password"
        const mail_text = `Your OTP is: ${otp}`
        const mail = new MailDispatcher(findUser.email, subject, mail_text);
        await mail.send_text_email();
        console.log("RESET PASSWORD MAIL SENT");
        return true;

    }

    async resetPassword(payload: resetPasswordType): Promise<boolean> {
        // retrieve userId with OTP
        const find_userId = this.cacheService.getData<string>(payload.otp);
        if (!find_userId) return false;
        
        const updateUser = await User.findByIdAndUpdate({ _id: find_userId }, { password: payload.password });
        console.log(updateUser, "USER UPDATED===");
        return true;
    }
}
