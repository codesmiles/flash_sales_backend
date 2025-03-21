import { Schema } from "joi";


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