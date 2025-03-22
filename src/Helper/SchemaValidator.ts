import Joi, { type Schema } from "joi";
import {UserRoles} from "./Constants"

export const validator = <T>(schema: Schema, data: T) => {
  let errorData: unknown;
  try {
    const { error } = schema.validate(data);
    if (error) {
      errorData = error.details.map((err) => err.message);

      return {
        message: "Validation error",
        status: 400,
        error: errorData
      };

    }
    return null;
  } catch (err) {
    errorData = err instanceof Error ? err.message : "Unknown error";
    console.error("Validation Error:", err);
    return {
      message: "Invalid payload",
      status: 400,
      error: errorData
    };
  }
};

export const validateUser = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid(...Object.values(UserRoles)).required(),
  password: Joi.string().required(),
});

export const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
export const validateForgotPassword = Joi.object({
  email: Joi.string().email().required(),

})
export const validateResetPassword = Joi.object({
  otp: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmNewPassword: Joi.string().required().valid(Joi.ref('newPassword')),
});
