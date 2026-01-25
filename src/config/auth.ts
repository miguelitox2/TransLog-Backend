import dotenv from "dotenv";
dotenv.config();

export const authConfig = {
  jwt: {
    secret: (process.env.JWT_SECRET as string) || "default-secret-para-dev",
    expiresIn: "1d" as string,
  },
};
